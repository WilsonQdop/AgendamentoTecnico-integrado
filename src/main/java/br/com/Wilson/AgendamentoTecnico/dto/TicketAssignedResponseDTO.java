package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;

public record TicketAssignedResponseDTO(String customer, String technical, StatusEnum status) {
}
