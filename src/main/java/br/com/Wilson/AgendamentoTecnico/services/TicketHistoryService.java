package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.TicketHistoryResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.TicketHistoryRequestDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.IllegalTicketStateException;
import br.com.Wilson.AgendamentoTecnico.exceptions.TicketNotFoundException;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.model.Ticket;
import br.com.Wilson.AgendamentoTecnico.model.TicketHistory;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;
import br.com.Wilson.AgendamentoTecnico.repositories.TicketHistoryRepository;
import br.com.Wilson.AgendamentoTecnico.repositories.TicketRepository;
import br.com.Wilson.AgendamentoTecnico.utils.AuthUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TicketHistoryService {
    private final AuditService auditService;
  private final TicketHistoryRepository historyRepository;
  private final TicketRepository ticketRepository;
  private final AuthUtil authUtil;


    public TicketHistoryService(AuditService auditService, TicketHistoryRepository historyRepository, TicketRepository ticketRepository,
                                AuthUtil authUtil) {
        this.auditService = auditService;
        this.historyRepository = historyRepository;
        this.ticketRepository = ticketRepository;
        this.authUtil = authUtil;
    }


    public TicketHistoryResponseDTO ChangeTicketHistory(TicketHistoryRequestDTO request, UUID id) {
        Technical technical = (Technical) this.authUtil.getUserLoggedIn();
        System.out.println("ID do Chamado recebido da URL: " + id);
        System.out.println("ID do Técnico logado no sistema: " + (technical != null ? technical.getId() : "NULO"));

        Ticket ticket = this.ticketRepository.findById(id).orElseThrow(
                () -> new TicketNotFoundException(id)
        );

        StatusEnum oldStatus = ticket.getStatus();

        if (ticket.getStatus().equals(StatusEnum.COMPLETED) || ticket.getStatus().equals(StatusEnum.PAYMENT_PENDING)
                || ticket.getStatus().equals(StatusEnum.CANCELED)) {
            auditService.log(
                    AuditAction.TICKET_FINISHED_PAYMENT_CANCELED, ticket.getId().toString(), "Não pode alterar chamados já finalizado," +
                            " concluidos ou aguardando pagamentos"
            );
            throw new IllegalTicketStateException();
        }
        TicketHistory ticketHistory = new TicketHistory();

        ticketHistory.setTicket(ticket);
        ticketHistory.setComment(request.comment());
        ticketHistory.setChangeDate(LocalDateTime.now());
        ticketHistory.setOldStatus(oldStatus);
        ticketHistory.setNewStatus(ticket.getStatus());
        ticketHistory.setUpdateBy(technical.getName());

        TicketHistory saved = this.historyRepository.save(ticketHistory);

        auditService.log(AuditAction.HISTORY_UPDATED, ticket.getId().toString(), "O técnico " + technical.getName() + " atualizou o chamado do cliente" +
                ticket.getCustomer().getName());

        return new TicketHistoryResponseDTO(saved.getId(), saved.getComment(), saved.getChangeDate(),
                saved.getNewStatus(), technical.getName()); // Retornar newStatus
    }
}
