package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.CategoryEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.PriorityEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TicketSummaryResponseDTO(
        UUID id,
        String title, CategoryEnum category,
        PriorityEnum priority, StatusEnum status, BigDecimal value, boolean paymentConfirmed,
        LocalDateTime createdAt, String customerName, String technicalName) {
}
