package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.CurrentUserDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.LoginRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.RegisterRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.ResponseDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.*;
import br.com.Wilson.AgendamentoTecnico.model.Customer;
import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.model.enums.Role;
import br.com.Wilson.AgendamentoTecnico.repositories.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class AuthService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 10;
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuditService auditService;

    public AuthService(PersonRepository personRepository, PasswordEncoder passwordEncoder, TokenService tokenService,
                       AuditService auditService) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.auditService = auditService;
    }

    public CurrentUserDTO getCurrentUserData() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // JWT sub = email

        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado"));

        String role = person.getRole() != null
                ? person.getRole().name().replace("ROLE_", "")
                : "USER";

        return new CurrentUserDTO(
                person.getId(),      // UUID
                person.getName(),    // Nome
                person.getEmail(),   // Email
                role                 // ADMIN, CUSTOMER, TECHNICAL
        );
    }

    public ResponseDTO login(LoginRequestDTO login) {
        Person person = this.personRepository.findByEmail(login.email()).orElseThrow(
                () -> {
                    auditService.log(
                            AuditAction.LOGIN_FAILED,
                            login.email(),
                            "Tentativa de login com email não cadastrado: " + login.email()
                    );
                    return new PersonNotFoundException(login.email());
                });

        // Conta bloqueada
        if (person.getLockedUntil() != null && LocalDateTime.now().isBefore(person.getLockedUntil())) {
            long minutesRemaining = java.time.Duration.between(
                    LocalDateTime.now(), person.getLockedUntil()).toMinutes() + 1;

            auditService.log(
                    AuditAction.LOGIN_FAILED,
                    person.getEmail(),
                    "Tentativa de login em conta bloqueada. Usuário: " + person.getName()
                            + " | Desbloqueio em " + minutesRemaining + " minuto(s)"
            );

            throw new AccountLockedException(minutesRemaining);
        }

        if (!passwordEncoder.matches(login.password(), person.getPassword())) {
            int attempts = person.getFailedLoginAttempts() + 1;
            person.setFailedLoginAttempts(attempts);

            auditService.log(
                    AuditAction.LOGIN_FAILED,
                    person.getEmail(),
                    "Senha incorreta para o usuário: " + person.getName()
                            + " | Tentativa " + attempts + " de " + MAX_ATTEMPTS
                            + " | Data/hora: " + LocalDateTime.now()
            );


            if (auditService.hasReachedDailyFailureLimit(person.getEmail())) {
                auditService.log(
                        AuditAction.LOGIN_BLOCKED,
                        person.getEmail(),
                        "Usuário " + person.getName()
                                + " atingiu 5 falhas de autenticação consecutivas no dia"
                                + " | Conta bloqueada por " + LOCK_MINUTES + " minutos"
                                + " | Data/hora: " + LocalDateTime.now()
                );
            }

            if (attempts >= MAX_ATTEMPTS) {
                person.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
            }

            personRepository.save(person);
            throw new InvalidPasswordException();
        }

        person.setFailedLoginAttempts(0);
        person.setLockedUntil(null);
        personRepository.save(person);

        auditService.log(
                AuditAction.LOGIN_SUCCESS,
                person.getEmail(),
                "Login realizado com sucesso. Usuário: " + person.getName()
        );

        String token = this.tokenService.generateToken(person);
        return new ResponseDTO(person.getName(), token);
    }

    public ResponseDTO register(RegisterRequestDTO register) {

        if (this.personRepository.existsByEmail(register.email())) {
            throw new EmailAlreadyInUseException();
        }

        if (!register.password().equals(register.passwordConfirmed())) {
            throw new PasswordsDoNotMatchException();
        }
        Person person = new Customer();

        person.setName(register.name());
        person.setEmail(register.email());
        person.setPhone(register.phone());
        person.setPassword(passwordEncoder.encode(register.password()));

        person.setRole(Role.CUSTOMER);

        person.setCreatedAt(LocalDateTime.now());
        personRepository.save(person);

        auditService.log(
                AuditAction.USER_CREATED,
                person.getEmail(),
                "Usuário com o email '" + person.getEmail() + "' foi criado com sucesso"
        );
        return new ResponseDTO(person.getName(), person.getEmail());
    }
}
