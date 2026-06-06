package br.com.Wilson.AgendamentoTecnico.dto.request;

import br.com.Wilson.AgendamentoTecnico.model.enums.Role;
import jakarta.validation.constraints.*;

public record RegisterRequestDTO(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank String phone,

//      @NotBlank @Size(min = 8) String password,

        @NotBlank
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{10,}$",
                message = "A senha deve ter no mínimo 10 caracteres, uma letra maiúscula, uma minúscula e um símbolo"
        )
        String password,
        @NotBlank String passwordConfirmed) {}
