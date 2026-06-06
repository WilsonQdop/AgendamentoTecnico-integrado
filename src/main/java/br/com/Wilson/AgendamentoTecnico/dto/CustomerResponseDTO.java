package br.com.Wilson.AgendamentoTecnico.dto;

import br.com.Wilson.AgendamentoTecnico.model.enums.Role;

public record CustomerResponseDTO(String name, String email, String phone, Role role) {
}
