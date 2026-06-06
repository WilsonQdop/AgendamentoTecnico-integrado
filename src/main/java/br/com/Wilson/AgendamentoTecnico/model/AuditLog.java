package br.com.Wilson.AgendamentoTecnico.model;

import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;
    private String target;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;


    public AuditLog(AuditAction action, String target, String description) {
        this.action = action;
        this.target = target;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public AuditLog() {

    }

    public UUID getId() { return id; }
    public AuditAction getAction() { return action; }
    public String getTarget() { return target; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
