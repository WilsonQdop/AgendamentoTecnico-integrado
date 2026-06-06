package br.com.Wilson.AgendamentoTecnico.exceptions;

public class TokenServiceException extends RuntimeException {
    public TokenServiceException() {
        super("Erro ao gerar o token de acesso");
    }
}
