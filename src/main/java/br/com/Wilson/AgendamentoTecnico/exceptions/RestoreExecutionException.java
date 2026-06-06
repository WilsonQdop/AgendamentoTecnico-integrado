package br.com.Wilson.AgendamentoTecnico.exceptions;

public class RestoreExecutionException extends RuntimeException {
    public RestoreExecutionException(String fileName) {
        super("Falha ao restaurar o backup. Arquivo: " + fileName);
    }

    public RestoreExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
