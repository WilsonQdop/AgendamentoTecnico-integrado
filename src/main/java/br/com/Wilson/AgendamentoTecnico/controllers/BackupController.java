package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.ScheduleBackupResponse;
import br.com.Wilson.AgendamentoTecnico.dto.request.BackupScheduleRequest;
import br.com.Wilson.AgendamentoTecnico.dto.request.ScheduleBackupRequest;
import br.com.Wilson.AgendamentoTecnico.services.BackupService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/backups")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }


    @PostMapping("/trigger")
    public ResponseEntity<Map<String, String>> triggerManualBackup() {
        String mensagem = backupService.executeBackup();
        return ResponseEntity.ok(Map.of("message", mensagem));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/schedule")
    public ResponseEntity<ScheduleBackupResponse> schedule(@RequestBody @Valid ScheduleBackupRequest request) {
        return ResponseEntity.ok(backupService.scheduleBackup(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/schedule/cancel")
    public ResponseEntity<ScheduleBackupResponse> cancel() {
        return ResponseEntity.ok(backupService.cancelScheduledBackup());
    }


    @PostMapping("/restore")
    public ResponseEntity<Map<String, String>> restore(@RequestParam("arquivo") String fileName) {
            String msg = backupService.executeRestore(fileName);
            return ResponseEntity.ok(Map.of("message", msg));
        }
    }


