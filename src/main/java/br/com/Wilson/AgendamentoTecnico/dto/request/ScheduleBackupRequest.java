package br.com.Wilson.AgendamentoTecnico.dto.request;

import br.com.Wilson.AgendamentoTecnico.model.enums.BackupFrequency;

import java.time.LocalDateTime;

public record ScheduleBackupRequest(LocalDateTime startDateTime, BackupFrequency frequency) {
}
