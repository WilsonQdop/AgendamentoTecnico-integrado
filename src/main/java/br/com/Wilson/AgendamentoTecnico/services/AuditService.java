package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.model.AuditLog;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.repositories.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private static final int MAX_DAILY_FAILURES = 5;

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(AuditAction action, String target, String description) {
        AuditLog entry = new AuditLog(action, target, description);
        auditLogRepository.save(entry);

        String message = "[{}] | Alvo: {} | Descrição: {}";
        switch (action) {
            case LOGIN_FAILED, LOGIN_BLOCKED, USER_DELETED ->
                    log.warn(message, action, target, description);
            default ->
                    log.info(message, action, target, description);
        }
    }

    public boolean hasReachedDailyFailureLimit(String email) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        long failures = auditLogRepository.countByActionAndTargetAndPeriod(
                AuditAction.LOGIN_FAILED, email, startOfDay, endOfDay
        );

        return failures >= MAX_DAILY_FAILURES;
    }

    public Page<AuditLog> getRecentLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }
}
