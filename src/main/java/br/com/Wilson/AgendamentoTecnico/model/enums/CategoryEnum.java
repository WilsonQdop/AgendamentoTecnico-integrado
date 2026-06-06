package br.com.Wilson.AgendamentoTecnico.model.enums;

import java.math.BigDecimal;

public enum CategoryEnum {

    HARDWARE(new BigDecimal("1.0")),
    SOFTWARE(new BigDecimal("1.3")),
    NETWORK(new BigDecimal("1.5"));

    private final BigDecimal weight;
    CategoryEnum(BigDecimal weight) { this.weight = weight; }
    public BigDecimal getWeight() { return weight; }
}
