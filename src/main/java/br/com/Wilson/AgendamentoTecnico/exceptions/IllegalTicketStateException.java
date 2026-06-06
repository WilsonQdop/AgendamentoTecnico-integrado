package br.com.Wilson.AgendamentoTecnico.exceptions;

public class IllegalTicketStateException extends RuntimeException {
    public IllegalTicketStateException() {
        super("Não é possível alterar um ticket já finalizado ou cancelado.");
    }
}
