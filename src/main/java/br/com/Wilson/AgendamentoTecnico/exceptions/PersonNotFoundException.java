package br.com.Wilson.AgendamentoTecnico.exceptions;

public class PersonNotFoundException extends RuntimeException {
    public PersonNotFoundException(String email) {
        super("usuário com email \" + email + \" não foi encontrado.");
    }
}
