package br.com.Wilson.AgendamentoTecnico.exceptions.controlleradice;

import br.com.Wilson.AgendamentoTecnico.exceptions.*;
import br.com.Wilson.AgendamentoTecnico.exceptions.message.RestErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Trata erros da @valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestErrorMessage> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();

        RestErrorMessage threatResponse = new RestErrorMessage(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação nos campos",
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(threatResponse);
    }

    // 404 NOT FOUND
    @ExceptionHandler({
            CustomerNotFoundByEmailException.class,
            CustomerNotFoundByIdException.class,
            PersonNotFoundException.class,
            TicketNotFoundException.class,
            TechnicalNotFoundException.class,
            TicketAccessDeniedException.class
    })
    public ResponseEntity<RestErrorMessage> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new RestErrorMessage(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }

    // 400 BAD REQUEST
    @ExceptionHandler({
            EmailAlreadyInUseException.class,
            IllegalTicketStateException.class,
            InvalidTicketValueException.class,
            PasswordsDoNotMatchException.class,
            PasswordRecentlyUsedException.class,
            TicketNotStartedException.class
    })
    public ResponseEntity<RestErrorMessage> handleBadRequest(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RestErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
    }

    // 401 UNAUTHORIZED
    @ExceptionHandler({
            InvalidPasswordException.class,
            InvalidTokenException.class,
            AccountLockedException.class
    })
    public ResponseEntity<RestErrorMessage> handleUnauthorized(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new RestErrorMessage(HttpStatus.UNAUTHORIZED.value(), ex.getMessage()));
    }

    // 500 INTERNAL SERVER ERROR
    @ExceptionHandler(TokenServiceException.class)
    public ResponseEntity<RestErrorMessage> handleInternalError(TokenServiceException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RestErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()));
    }
}
