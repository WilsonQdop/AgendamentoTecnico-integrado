package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

import java.time.LocalDateTime;

public record TicketHistoryResponseDTO(String comment, LocalDateTime changeDate, StatusEnum newStatus, String updateBy) {
}
