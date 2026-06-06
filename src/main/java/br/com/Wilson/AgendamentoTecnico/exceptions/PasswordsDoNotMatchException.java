package br.com.Wilson.AgendamentoTecnico.exceptions;

public class PasswordsDoNotMatchException extends RuntimeException {
    public PasswordsDoNotMatchException() {
        super("A senha e a confirmação de senha devem ser iguais.");
    }
}
