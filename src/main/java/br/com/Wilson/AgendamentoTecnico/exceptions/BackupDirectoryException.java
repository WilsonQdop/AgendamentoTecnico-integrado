package br.com.Wilson.AgendamentoTecnico.exceptions;


public class BackupDirectoryException extends RuntimeException {
    public BackupDirectoryException(String path, Throwable cause) {
        super("Erro ao criar o diretório de backups: " + path, cause);
    }}
