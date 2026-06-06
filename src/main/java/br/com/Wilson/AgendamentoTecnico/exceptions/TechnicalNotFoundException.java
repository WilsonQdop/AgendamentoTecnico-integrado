package br.com.Wilson.AgendamentoTecnico.exceptions;

import java.util.UUID;

public class TechnicalNotFoundException extends RuntimeException {
    public TechnicalNotFoundException(UUID id) {
        super("Técnico com email \" + id + \" não foi encontrado.");
    }
}
