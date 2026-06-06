package br.com.Wilson.AgendamentoTecnico.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCustomerRequestDTO(
        @NotBlank String name,
        @NotBlank
        String phone,
        @NotBlank
        @Size(min = 8) String password) {
}
