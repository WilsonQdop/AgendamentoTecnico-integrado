package br.com.Wilson.AgendamentoTecnico.utils;

import br.com.Wilson.AgendamentoTecnico.model.Person;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class AuthUtil {
    
    public Person getUserLoggedIn() {
        return (Person) Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getPrincipal();
    }
}
