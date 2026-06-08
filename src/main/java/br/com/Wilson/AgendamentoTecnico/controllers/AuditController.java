package br.com.Wilson.AgendamentoTecnico.controllers;
import br.com.Wilson.AgendamentoTecnico.model.AuditLog;
import br.com.Wilson.AgendamentoTecnico.services.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<Page<AuditLog>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<AuditLog> logs = auditService.getRecentLogs(page, size);
        return ResponseEntity.ok(logs);
    }
}
