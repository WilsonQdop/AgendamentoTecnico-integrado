package br.com.Wilson.AgendamentoTecnico.exceptions;

public class TicketAccessDeniedException extends RuntimeException {
    public TicketAccessDeniedException() {
        super("Você não tem permissão para ver este chamado.");
    }
}
