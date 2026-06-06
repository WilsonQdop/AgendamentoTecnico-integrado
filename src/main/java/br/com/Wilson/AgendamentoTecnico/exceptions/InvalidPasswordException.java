package br.com.Wilson.AgendamentoTecnico.exceptions;

public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException() {
        super("Senha incorreta.");
    }
}
