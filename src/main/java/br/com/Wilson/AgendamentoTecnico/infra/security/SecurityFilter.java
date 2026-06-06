package br.com.Wilson.AgendamentoTecnico.infra.security;

import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.repositories.PersonRepository;
import br.com.Wilson.AgendamentoTecnico.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final PersonRepository personRepository;
    private final HandlerExceptionResolver resolver;

    // Construtor explícito para resolver a ambiguidade dos Beans
    public SecurityFilter(
            TokenService tokenService,
            PersonRepository personRepository,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
        this.tokenService = tokenService;
        this.personRepository = personRepository;
        this.resolver = resolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = this.recoverToken(request);

            if (token != null) {
                String login = tokenService.validateToken(token);

                if (login != null) {
                    Person user = personRepository.findByEmail(login).orElseThrow(() ->
                            new UsernameNotFoundException("Usuário não encontrado"));

                    // Adicione esses logs
                    System.out.println("=== SECURITY FILTER ===");
                    System.out.println("Email: " + user.getEmail());
                    System.out.println("Role: " + user.getRole());
                    System.out.println("Authority: ROLE_" + (user.getRole() != null ? user.getRole().name() : "NULL"));

                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                    );

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            authorities
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            // Segue o fluxo normal se tudo estiver ok
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Esse "resolver" envia a exceção para o seu @RestControllerAdvice
            resolver.resolveException(request, response, null, e);
        }
    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization"); // Mudar para outro cabeçalho caso seja necessário
        if(authHeader == null) {
            return null;
        }
        return authHeader.replace("Bearer ", "");
    }
}
