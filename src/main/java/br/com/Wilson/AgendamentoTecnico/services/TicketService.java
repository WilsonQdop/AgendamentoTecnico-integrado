package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.*;
import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTicketRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.PaymentRequestDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.*;
import br.com.Wilson.AgendamentoTecnico.model.Customer;
import br.com.Wilson.AgendamentoTecnico.model.Person;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.model.Ticket;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;
import br.com.Wilson.AgendamentoTecnico.repositories.TicketRepository;
import br.com.Wilson.AgendamentoTecnico.utils.AuthUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AuthUtil authUtil;
    private final AuditService auditService;

    public TicketService(TicketRepository ticketRepository,
                         AuthUtil authUtil,
                         AuditService auditService) {
        this.ticketRepository = ticketRepository;
        this.authUtil = authUtil;
        this.auditService = auditService;
    }

    // EVENTO 1: Criação de chamado
    public CreateTicketResponseDTO createTicket(CreateTicketRequestDTO request) {
        Customer customer = (Customer) this.authUtil.getUserLoggedIn();
        Ticket ticket = new Ticket();

        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setStatus(StatusEnum.OPEN);
        ticket.setCustomer(customer);

        Ticket saved = this.ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_CREATED,
                customer.getName(),
                "Chamado criado: '" + saved.getTitle() + "' | Categoria: " + saved.getCategory()
                        + " | Prioridade: " + saved.getPriority()
        );

        return new CreateTicketResponseDTO(saved.getTitle(), saved.getDescription(), saved.getCategory(),
                saved.getPriority(), saved.getStatus(), saved.isPaymentConfirmed(),
                saved.getCreatedAt(), saved.getCustomer().getName());
    }

    // EVENTO 2: Atribuição de técnico
    public TicketAssignedResponseDTO ticketAssigned(UUID ticketId) {
        Technical technical = (Technical) this.authUtil.getUserLoggedIn();
        Ticket ticket = this.findById(ticketId);

        ticket.setTechnical(technical);
        ticket.setStatus(StatusEnum.ASSIGNED);

        Ticket saved = this.ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_ASSIGNED,
                technical.getName(),
                "Técnico '" + technical.getName() + "' assumiu o chamado '" + ticket.getTitle()
                        + "' do cliente '" + ticket.getCustomer().getName() + "'"
        );

        return new TicketAssignedResponseDTO(
                saved.getCustomer().getName(),
                saved.getTechnical().getName(),
                saved.getStatus()
        );
    }

    // EVENTO 3: Início do atendimento
    public void startingTicket(UUID ticketId) {
        Ticket ticket = this.findById(ticketId);

        ticket.setStartedAt(LocalDateTime.now());
        ticket.setStatus(StatusEnum.IN_PROGRESS);

        this.ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_STARTED,
                ticket.getTechnical() != null ? ticket.getTechnical().getName() : "Sistema",
                "Atendimento iniciado para o chamado '" + ticket.getTitle() + "'"
        );
    }

    public void cancel(UUID ticketId) {
        Ticket ticket = this.findById(ticketId);

        ticket.setStartedAt(LocalDateTime.now());
        ticket.setStatus(StatusEnum.CANCELED);

        ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_CANCELED,
                ticket.getTechnical() != null ? ticket.getTechnical().getName() : "Sistema",
                "Atendimento foi cancelado para o chamado '" + ticket.getTitle() + "'"
        );
    }

    // EVENTO 4: Finalização do chamado
    public void finishTicket(UUID ticketId) {
        Ticket ticket = this.findById(ticketId);

        ticket.setFinishedAt(LocalDateTime.now());
        ticket.setStatus(StatusEnum.PAYMENT_PENDING);

        BigDecimal valueTotal = calculateServiceValue(ticket);
        ticket.setValue(valueTotal);

        ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_FINISHED,
                ticket.getTechnical() != null ? ticket.getTechnical().getName() : "Sistema",
                "Chamado '" + ticket.getTitle() + "' finalizado. Valor calculado: R$ " + valueTotal
        );
    }
    public void customerPaymentTicket(UUID ticketId, PaymentRequestDTO request) {
        Ticket ticket = this.findById(ticketId);

        if (ticket.getValue().compareTo(request.value()) != 0) {
            throw new InvalidTicketValueException();
        }

        if (ticket.getStatus().equals(StatusEnum.COMPLETED) || ticket.getStatus().equals(StatusEnum.CANCELED)) {
            throw new IllegalTicketStateException();
        }

        ticket.setPaymentConfirmed(true);
        ticket.setStatus(StatusEnum.COMPLETED);

        this.ticketRepository.save(ticket);

        auditService.log(
                AuditAction.TICKET_PAYMENT,
                ticket.getCustomer().getName(),
                "Pagamento de R$ " + request.value() + " confirmado para o chamado '" + ticket.getTitle() + "'"
        );
    }

    public Stream<TicketSummaryResponseDTO> getAllSummaryTickets() {
        List<Ticket> ticketList = this.ticketRepository.findAll();

        return ticketList.stream()
                .map(ticket -> new TicketSummaryResponseDTO(
                        ticket.getId(), ticket.getTitle(), ticket.getCategory(),
                        ticket.getPriority(), ticket.getStatus(), ticket.getValue(),
                        ticket.isPaymentConfirmed(), ticket.getCreatedAt(),
                        ticket.getCustomer().getName(),
                        ticket.getTechnical() != null ? ticket.getTechnical().getName() : "Nenhum técnico atribuído"
                ));
    }

    public TicketDetailsResponseDTO viewTicketsDetails(UUID ticketId) {
        Person loggedUser = authUtil.getUserLoggedIn();
        Ticket ticket = this.ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        switch (loggedUser.getRole()) {
            case CUSTOMER -> {
                if (ticket.getCustomer() == null || !ticket.getCustomer().getEmail().equals(loggedUser.getEmail())) {
                    throw new TicketAccessDeniedException();
                }
            }
            case TECHNICAL -> {
                if (ticket.getTechnical() == null || !ticket.getTechnical().getEmail().equals(loggedUser.getEmail())) {
                    throw new TicketAccessDeniedException();
                }
            }
            default -> throw new IllegalArgumentException("Role inválida: " + loggedUser.getRole());
        }

        auditService.log(
                AuditAction.TICKET_VIEWED,
                loggedUser.getName(),
                "Detalhes do chamado '" + ticket.getTitle() + "' visualizados por " + loggedUser.getName()
        );

        // 🔥 1. Converte a lista de TicketHistory da entidade para a lista de DTOs do frontend
        List<TicketHistoryResponseDTO> historyDTOs = ticket.getTicketHistories().stream()
                .map(history -> new TicketHistoryResponseDTO(
                        history.getId(),
                        history.getComment(),
                        history.getChangeDate(),
                        history.getNewStatus(),
                        history.getUpdateBy()
                ))
                .toList();

        // 2. Retorna o record incluindo a lista mapeada no final
        return new TicketDetailsResponseDTO(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getBaseHourlyRate() != null ? ticket.getBaseHourlyRate() : BigDecimal.valueOf(100),
                ticket.getValue() != null ? ticket.getValue() : BigDecimal.valueOf(100),
                ticket.isPaymentConfirmed(),
                ticket.getCreatedAt(),
                ticket.getCustomer() != null ? ticket.getCustomer().getName() : "N/A",
                ticket.getCustomer() != null ? ticket.getCustomer().getId() : null,
                ticket.getTechnical() != null ? ticket.getTechnical().getName() : null,
                ticket.getTechnical() != null ? ticket.getTechnical().getId() : null,
                historyDTOs // 🔥 O novo argumento correspondente à lista 'updates' no record
        );
    }

    public Stream<TicketSummaryResponseDTO> getMyTickets() {
        Person loggedUser = authUtil.getUserLoggedIn();

        List<Ticket> ticketList = switch (loggedUser.getRole()) {
            case CUSTOMER -> ticketRepository.findByCustomer(loggedUser);
            case TECHNICAL -> ticketRepository.findByTechnical(loggedUser);
            default -> Collections.emptyList();
        };

        return ticketList.stream().map(ticket -> new TicketSummaryResponseDTO(
                ticket.getId(), ticket.getTitle(), ticket.getCategory(),
                ticket.getPriority(), ticket.getStatus(), ticket.getValue(),
                ticket.isPaymentConfirmed(), ticket.getCreatedAt(),
                ticket.getCustomer().getName(),
                ticket.getTechnical() != null ? ticket.getTechnical().getName() : "Nenhum técnico atribuído"
        ));
    }

    private BigDecimal calculateServiceValue(Ticket ticket) {
        if (ticket.getStartedAt() == null) {
            throw new TicketNotStartedException();
        }

        long hours = Duration.between(ticket.getStartedAt(), ticket.getFinishedAt()).toHours();
        BigDecimal hoursToBill = new BigDecimal(Math.max(hours, 1));
        BigDecimal baseValue = ticket.getBaseHourlyRate();

        return baseValue
                .multiply(hoursToBill)
                .multiply(ticket.getCategory().getWeight())
                .multiply(ticket.getPriority().getWeight());
    }

    private Ticket findById(UUID ticketId) {
        return this.ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));
    }
}