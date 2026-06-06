package br.com.Wilson.AgendamentoTecnico.exceptions;

public class InvalidTicketValueException extends RuntimeException {
    public InvalidTicketValueException() {
        super("O valor fornecido não coincide com o ticket.");
    }
}
