package br.com.Wilson.AgendamentoTecnico.exceptions;

public class BackupFileNotFoundException extends RuntimeException {
    public BackupFileNotFoundException(String fileName) {
        super("Arquivo de backup não encontrado: " + fileName);
    }
}
