package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.BackupFrequency;

import java.time.LocalDateTime;

public class ScheduleBackupResponse {

    private String message;
    private BackupFrequency frequency;
    private LocalDateTime nextExecution;
    private boolean active;

    // Builder pattern para construção limpa
    private ScheduleBackupResponse() {}

    public static ScheduleBackupResponse of(BackupFrequency frequency, LocalDateTime nextExecution) {
        ScheduleBackupResponse response = new ScheduleBackupResponse();
        response.message = "Backup agendado com sucesso!";
        response.frequency = frequency;
        response.nextExecution = nextExecution;
        response.active = true;
        return response;
    }

    public static ScheduleBackupResponse cancelled() {
        ScheduleBackupResponse response = new ScheduleBackupResponse();
        response.message = "Agendamento cancelado.";
        response.active = false;
        return response;
    }

    public String getMessage() { return message; }
    public BackupFrequency getFrequency() { return frequency; }
    public LocalDateTime getNextExecution() { return nextExecution; }
    public boolean isActive() { return active; }
}
