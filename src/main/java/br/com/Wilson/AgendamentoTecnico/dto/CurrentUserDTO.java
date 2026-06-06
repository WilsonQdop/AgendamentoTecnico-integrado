package br.com.Wilson.AgendamentoTecnico.dto;

import java.util.UUID;

public record CurrentUserDTO( UUID id,
         String name,
         String email,
         String role) {
}
