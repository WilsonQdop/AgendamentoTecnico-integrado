package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.ScheduleBackupResponse;
import br.com.Wilson.AgendamentoTecnico.dto.request.ScheduleBackupRequest;
import br.com.Wilson.AgendamentoTecnico.exceptions.BackupDirectoryException;
import br.com.Wilson.AgendamentoTecnico.exceptions.BackupExecutionException;
import br.com.Wilson.AgendamentoTecnico.exceptions.BackupFileNotFoundException;
import br.com.Wilson.AgendamentoTecnico.exceptions.RestoreExecutionException;
import br.com.Wilson.AgendamentoTecnico.model.enums.BackupFrequency;
import br.com.Wilson.AgendamentoTecnico.utils.BackupSchedulerState;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class BackupService {
    @Value("${DB_NAME:agendamentos_db}")
    private String dbName;

    @Value("${DB_USER:Qdop}")
    private String dbUser;

    @Value("${DB_PASS:Qdop123}")
    private String dbPass;

    private final String BACKUP_DIR = "./backups";

    private final BackupSchedulerState schedulerState = new BackupSchedulerState();

    public String executeBackup() {
        try {
            Path backupPath = Paths.get(BACKUP_DIR);
            if (!Files.exists(backupPath)) {
                try {
                    Files.createDirectories(backupPath);
                } catch (IOException e) {
                    throw new BackupDirectoryException(BACKUP_DIR, e);
                }
            }
            String safeDbName = dbName.replaceAll("[^a-zA-Z0-9_\\-]", "");

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = "backup_" + safeDbName + "_" + timestamp + ".sql";
            File outputFile = new File(backupPath.toFile(), fileName);

            List<String> command = new ArrayList<>();
            command.add("docker");
            command.add("exec");
            command.add("-e");
            command.add("PGPASSWORD=" + dbPass);
            command.add("postgres-agendamento-tecnico");
            command.add("pg_dump");
            command.add("--clean");
            command.add("--if-exists");
            command.add("-U");
            command.add(dbUser);
            command.add("-d");
            command.add(dbName);

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectOutput(outputFile);

            pb.redirectError(ProcessBuilder.Redirect.INHERIT);

            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                return "Backup realizado com sucesso! Arquivo: " + fileName;
            } else {
                throw new BackupExecutionException(fileName, exitCode);
            }

        } catch (IOException e) {
            throw new BackupExecutionException("Erro de I/O ao processar o backup do banco de dados", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BackupExecutionException("O processo de backup foi interrompido", e);
        }
    }

    public String executeRestore(String fileName) {
        try {
            File safeFile = new File(fileName);
            String isolatedFileName = safeFile.getName();

            if (!isolatedFileName.matches("^[a-zA-Z0-9_\\-]+\\.sql$")) {
                throw new IllegalArgumentException("Nome de arquivo de backup inválido ou malicioso.");
            }

            File inputFile = new File(BACKUP_DIR, isolatedFileName);
            if (!inputFile.exists()) {
                throw new BackupFileNotFoundException(isolatedFileName);
            }
            List<String> cleanCmd = List.of(
                    "docker", "exec", "postgres-agendamento-tecnico",
                    "psql", "-U", dbUser, "-d", dbName,
                    "-c", "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
            );

            Process cleanProcess = new ProcessBuilder(cleanCmd)
                    .redirectError(ProcessBuilder.Redirect.INHERIT)
                    .redirectOutput(ProcessBuilder.Redirect.INHERIT)
                    .start();

            int cleanExitCode = cleanProcess.waitFor();
            if (cleanExitCode != 0) {
                throw new RestoreExecutionException("Falha ao limpar o banco de dados antes do restore.");
            }

            List<String> command = new ArrayList<>();
            command.add("docker");
            command.add("exec");
            command.add("-i");
            command.add("-e");
            command.add("PGPASSWORD=" + dbPass);
            command.add("postgres-agendamento-tecnico");
            command.add("psql");
            command.add("-U");
            command.add(dbUser);
            command.add("-d");
            command.add(dbName);

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectInput(inputFile);
            pb.redirectError(ProcessBuilder.Redirect.INHERIT);

            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RestoreExecutionException(isolatedFileName);
            }

            return "Restore 100%!";

        } catch (IllegalArgumentException | BackupFileNotFoundException e) {
            throw e;
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new RestoreExecutionException("Erro ao restaurar: " + e.getMessage(), e);
        }
    }
    
    public ScheduleBackupResponse scheduleBackup(ScheduleBackupRequest request) {
        schedulerState.stop();

        schedulerState.setNextExecution(request.startDateTime());
        schedulerState.setFrequency(request.frequency());
        schedulerState.setRunning(true);

        Thread thread = new Thread(() -> {
            while (schedulerState.isRunning()) {
                try {
                    LocalDateTime now = LocalDateTime.now();

                    if (!now.isBefore(schedulerState.getNextExecution())) {
                        executeBackup();

                        if (schedulerState.getFrequency() == BackupFrequency.ONCE) {
                            schedulerState.stop();
                            break;
                        }

                        schedulerState.setNextExecution(
                                nextOccurrence(schedulerState.getNextExecution(), schedulerState.getFrequency())
                        );
                    }

                    Thread.sleep(10_000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });

        thread.setDaemon(true);
        thread.setName("backup-scheduler");
        schedulerState.setThread(thread);
        thread.start();

        return ScheduleBackupResponse.of(request.frequency(), request.startDateTime());
    }

    public ScheduleBackupResponse cancelScheduledBackup() {
        schedulerState.stop();
        return ScheduleBackupResponse.cancelled();
    }

    private LocalDateTime nextOccurrence(LocalDateTime current, BackupFrequency frequency) {
        return switch (frequency) {
            case DAILY   -> current.plusDays(1);
            case WEEKLY  -> current.plusWeeks(1);
            case MONTHLY -> current.plusMonths(1);
            default      -> current;
        };
    }
}


