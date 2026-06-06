package br.com.Wilson.AgendamentoTecnico.repositories;

import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByCustomer(Person customer);
    List<Ticket> findByTechnical(Person technical);
}
