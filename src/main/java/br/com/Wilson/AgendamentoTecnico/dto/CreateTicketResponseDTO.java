package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.CategoryEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.PriorityEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

import java.time.LocalDateTime;

public record CreateTicketResponseDTO(
        String title,
        String description,
        CategoryEnum category,
        PriorityEnum priority,
        StatusEnum status,
        boolean paymentConfirmed,
        LocalDateTime createdAt,
        String customerName) {
}
