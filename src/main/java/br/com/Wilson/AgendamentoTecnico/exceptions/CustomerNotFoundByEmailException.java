package br.com.Wilson.AgendamentoTecnico.exceptions;

public class CustomerNotFoundByEmailException extends RuntimeException {
    public CustomerNotFoundByEmailException(String email) {
        super("Cliente com email \" + email + \" não foi encontrado.");
    }
}
