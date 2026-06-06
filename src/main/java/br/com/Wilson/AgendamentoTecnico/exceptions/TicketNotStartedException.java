package br.com.Wilson.AgendamentoTecnico.exceptions;

public class TicketNotStartedException extends RuntimeException {
    public TicketNotStartedException() {
        super("Não é possível finalizar um ticket que não foi iniciado.");
    }
}
