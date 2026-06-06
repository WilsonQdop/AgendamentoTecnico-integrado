package br.com.Wilson.AgendamentoTecnico.dto.request;

import br.com.Wilson.AgendamentoTecnico.model.enums.CategoryEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.PriorityEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTicketRequestDTO(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull CategoryEnum category,
        @NotNull PriorityEnum priority) {}
