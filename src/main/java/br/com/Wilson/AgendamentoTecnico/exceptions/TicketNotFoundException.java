package br.com.Wilson.AgendamentoTecnico.exceptions;

import java.util.UUID;

public class TicketNotFoundException extends RuntimeException {

    public TicketNotFoundException(UUID id) {
        super("Ticket com ID \" + id + \" não foi encontrado.");
    }
}
