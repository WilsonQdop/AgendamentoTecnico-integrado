package br.com.Wilson.AgendamentoTecnico.exceptions;

import java.util.UUID;

public class CustomerNotFoundByIdException extends RuntimeException {

    public CustomerNotFoundByIdException(UUID id) {
        super("Cliente com email \" + id + \" não foi encontrado.");
    }
}
