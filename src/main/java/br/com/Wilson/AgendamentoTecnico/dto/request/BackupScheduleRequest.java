package br.com.Wilson.AgendamentoTecnico.dto.request;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record BackupScheduleRequest(
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime data
) {}