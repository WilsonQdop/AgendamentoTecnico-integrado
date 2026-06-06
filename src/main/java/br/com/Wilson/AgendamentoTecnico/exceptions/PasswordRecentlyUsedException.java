package br.com.Wilson.AgendamentoTecnico.exceptions;

public class PasswordRecentlyUsedException extends RuntimeException {
    public PasswordRecentlyUsedException() {
        super("A senha escolhida foi usada recentemente. Escolha uma senha diferente.");
    }
}