package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTechnicalRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.UpdateTechnicalResponseDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.PasswordRecentlyUsedException;
import br.com.Wilson.AgendamentoTecnico.exceptions.PasswordsDoNotMatchException;
import br.com.Wilson.AgendamentoTecnico.model.PasswordHistory;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.repositories.PasswordHistoryRepository;
import br.com.Wilson.AgendamentoTecnico.repositories.TechnicalRepository;
import br.com.Wilson.AgendamentoTecnico.utils.AuthUtil;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TechnicalService {

    private final TechnicalRepository technicalRepository;
    private final AuthUtil authUtil;
    private final PasswordEncoder passwordEncoder;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final AuditService auditService;

    public TechnicalService(TechnicalRepository technicalRepository, AuthUtil authUtil, PasswordEncoder passwordEncoder,
                            PasswordHistoryRepository passwordHistoryRepository, AuditService auditService) {
        this.technicalRepository = technicalRepository;
        this.authUtil = authUtil;
        this.passwordEncoder = passwordEncoder;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.auditService = auditService;
    }

    public UpdateTechnicalResponseDTO updateTechnical(CreateTechnicalRequestDTO request) {
        Technical technical = (Technical) this.authUtil.getUserLoggedIn();

        technical.setName(request.name());
        technical.setPhone(request.phone());

        if (request.password() != null && !request.password().isEmpty()) {
            if (!request.password().equals(request.passwordConfirmed())) {
                throw new PasswordsDoNotMatchException();
            }

            List<PasswordHistory> history = passwordHistoryRepository
                    .findTop3ByPersonOrderByCreatedAtDesc(technical);

            boolean recentlyUsed = history.stream()
                    .anyMatch(h -> passwordEncoder.matches(request.password(), h.getHashedPassword()));

            if (recentlyUsed) {
                throw new PasswordRecentlyUsedException();
            }

            String encodedPassword = passwordEncoder.encode(request.password());
            technical.setPassword(encodedPassword);

            passwordHistoryRepository.save(new PasswordHistory(technical, encodedPassword));
        }

        Technical saved = this.technicalRepository.save(technical);

        auditService.log(
                AuditAction.USER_UPDATED,
                saved.getEmail(),
                "Dados do técnico '" + saved.getName() + "' atualizados"
        );

        return new UpdateTechnicalResponseDTO(saved.getName(), saved.getEmail(), saved.getPhone());
    }

    public void technicalDeleteAccount() {
        Technical technical = (Technical) this.authUtil.getUserLoggedIn();

        this.technicalRepository.delete(technical);

        auditService.log(
                AuditAction.USER_DELETED,
                technical.getEmail(),
                "Técnico '" + technical.getName() + "' deletou sua conta"
        );

    }
}
