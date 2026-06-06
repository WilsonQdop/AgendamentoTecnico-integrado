package br.com.Wilson.AgendamentoTecnico.repositories;

import br.com.Wilson.AgendamentoTecnico.model.PasswordHistory;
import br.com.Wilson.AgendamentoTecnico.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, UUID> {

    List<PasswordHistory> findTop3ByPersonOrderByCreatedAtDesc(Person person);
}