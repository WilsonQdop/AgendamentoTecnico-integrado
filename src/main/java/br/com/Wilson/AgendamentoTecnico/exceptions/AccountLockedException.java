package br.com.Wilson.AgendamentoTecnico.exceptions;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException(long minutesRemaining) {
        super("Conta bloqueada por excesso de tentativas. Tente novamente em "
                + minutesRemaining + " minuto(s).");
    }
}