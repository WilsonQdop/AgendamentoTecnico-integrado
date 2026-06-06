package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.exceptions.InvalidTokenException;
import br.com.Wilson.AgendamentoTecnico.exceptions.TokenServiceException;
import br.com.Wilson.AgendamentoTecnico.model.Person;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class TokenService {
    @Value("${api.security.token.secret:fallback-secret-key-123}")
    private String keySecret;

    public String generateToken(Person person) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(keySecret);

            String token = JWT.create()
                    .withIssuer("AgendamentoTecnico")
                    .withSubject(person.getEmail())
                    .withClaim("roles", List.of("ROLE_" + person.getRole().name()))
                    .withExpiresAt(this.GenerateExpirationDate())
                    .sign(algorithm);
            return token;

        } catch (JWTCreationException j) {
            throw new TokenServiceException();
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(keySecret);
            return JWT.require(algorithm)
                    .withIssuer("AgendamentoTecnico")
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException c) {
            throw new InvalidTokenException();
        }
    }
    private Instant GenerateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
