package br.com.Wilson.AgendamentoTecnico.repositories;

import br.com.Wilson.AgendamentoTecnico.model.AuditLog;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @Query("""
        SELECT COUNT(a) FROM AuditLog a
        WHERE a.action = :action
        AND a.target = :target
        AND a.createdAt BETWEEN :from AND :to
    """)
    long countByActionAndTargetAndPeriod(
            @Param("action") AuditAction action,
            @Param("target") String target,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
