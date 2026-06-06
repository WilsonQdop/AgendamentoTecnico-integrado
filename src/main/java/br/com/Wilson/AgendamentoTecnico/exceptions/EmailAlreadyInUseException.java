package br.com.Wilson.AgendamentoTecnico.exceptions;

public class EmailAlreadyInUseException extends RuntimeException {

    public EmailAlreadyInUseException() {
        super("email já existe");
    }
}
