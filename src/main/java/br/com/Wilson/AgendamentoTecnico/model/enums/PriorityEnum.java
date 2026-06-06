package br.com.Wilson.AgendamentoTecnico.model.enums;

import java.math.BigDecimal;

public enum PriorityEnum {
    LOW(new BigDecimal("1.0")),
    MEDIUM(new BigDecimal("1.2")),
    HIGH(new BigDecimal("1.5"));

    private final BigDecimal weight;
    PriorityEnum(BigDecimal weight) { this.weight = weight; }
    public BigDecimal getWeight() { return weight; }
}
