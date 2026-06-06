package br.com.Wilson.AgendamentoTecnico.exceptions;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super("Token inválido ou expirado");
    }
}
