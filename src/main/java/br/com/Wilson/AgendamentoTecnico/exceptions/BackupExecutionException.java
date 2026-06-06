package br.com.Wilson.AgendamentoTecnico.exceptions;

public class BackupExecutionException extends RuntimeException {
    public BackupExecutionException(String fileName, int exitCode) {
        super("Falha ao executar o backup. Arquivo: " + fileName + " | Código de saída: " + exitCode);
    }

    public BackupExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
