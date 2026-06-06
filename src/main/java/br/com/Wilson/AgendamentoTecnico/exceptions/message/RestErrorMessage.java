package br.com.Wilson.AgendamentoTecnico.exceptions.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RestErrorMessage(
        LocalDateTime timestamp,
        int status,
        String message,
        List<String> errors
) {
    public RestErrorMessage(int status, String message) {
        this(LocalDateTime.now(), status, message, null);
    }

    public RestErrorMessage(int status, String message, List<String> errors) {
        this(LocalDateTime.now(), status, message, errors);
    }
}
