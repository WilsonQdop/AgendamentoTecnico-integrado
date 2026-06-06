package br.com.Wilson.AgendamentoTecnico.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PaymentRequestDTO(
        @NotNull @DecimalMin(value = "00.1") BigDecimal value) {}
