package br.com.Wilson.AgendamentoTecnico.repositories;

import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {

    Optional<Person> findByEmail (String login);

    boolean existsByEmail(String email);



}
