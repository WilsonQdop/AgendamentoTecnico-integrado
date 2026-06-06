package br.com.Wilson.AgendamentoTecnico.repositories;

import br.com.Wilson.AgendamentoTecnico.model.Technical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TechnicalRepository extends JpaRepository<Technical, UUID> {
    Optional<Technical> findByEmail(String email);
    boolean existsByEmail(String email);
}
