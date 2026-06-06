package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.CurrentUserDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.LoginRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.RegisterRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.ResponseDTO;
import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.services.AuthService;
import br.com.Wilson.AgendamentoTecnico.services.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody @Valid LoginRequestDTO login) {
        ResponseDTO response = authService.login(login);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody @Valid RegisterRequestDTO register) {
        ResponseDTO response = authService.register(register);
        return ResponseEntity.created(null).body(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TECHNICAL') or hasRole('CUSTOMER') or hasRole('ADMIN')")
        public ResponseEntity<CurrentUserDTO> getCurrentUser() {
            return ResponseEntity.ok(authService.getCurrentUserData());
        }
}