package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.CategoryEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.PriorityEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TicketDetailsResponseDTO(
        UUID id,
        String title,
        String description,
        CategoryEnum category,
        PriorityEnum priority,
        StatusEnum status,
        BigDecimal baseValue,       // Alterado para bater com o JSON do front
        BigDecimal finalValue,      // Alterado para bater com o JSON do front
        boolean paymentConfirmed,
        LocalDateTime creationDate, // Alterado para bater com o JSON do front
        String clientName,          // Alterado para bater com o JSON do front
        String technicalName,
        UUID technicalId,
        List<TicketHistoryResponseDTO> updates // A lista de históricos aqui dentro!


) {}
