package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketHistoryResponseDTO(
        UUID id,
        String comment,
        LocalDateTime changeDate,
        StatusEnum newStatus,
        String updateBy) {
}
