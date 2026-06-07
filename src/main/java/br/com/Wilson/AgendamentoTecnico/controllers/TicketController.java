package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.CreateTicketResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.TicketDetailsResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTicketRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.PaymentRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.TicketSummaryResponseDTO;
import br.com.Wilson.AgendamentoTecnico.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequestMapping("/ticket")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/create")
    public ResponseEntity<CreateTicketResponseDTO> createTicket(@RequestBody CreateTicketRequestDTO requestDTO) {
        CreateTicketResponseDTO ticket = this.ticketService.createTicket(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @PreAuthorize("hasRole('TECHNICAL')")
    @PutMapping("/finish/{ticketId}")
    public ResponseEntity<Void> finishTicket(@PathVariable UUID ticketId) {
        this.ticketService.finishTicket(ticketId);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('TECHNICAL')")
    @PutMapping("/start/{ticketId}")
    public ResponseEntity<Void> startingTicket(@PathVariable UUID ticketId) {
        this.ticketService.startingTicket(ticketId);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('TECHNICAL')")
    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelTicket(@PathVariable UUID id) {
        this.ticketService.cancel(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/payment/{ticketId}")
    public ResponseEntity<Void> customerPaymentTicket(@PathVariable UUID ticketId, @RequestBody @Valid PaymentRequestDTO request) {
        this.ticketService.customerPaymentTicket(ticketId, request);

        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('TECHNICAL', 'ADMIN')")
    @GetMapping("/findAll")
    public ResponseEntity<Stream<TicketSummaryResponseDTO>> getAllTickets () {

        return ResponseEntity.ok(this.ticketService.getAllSummaryTickets());
    }

    @PreAuthorize("hasAnyRole('TECHNICAL', 'CUSTOMER')")
    @GetMapping("/findMyTickets")
    public ResponseEntity<Stream<TicketSummaryResponseDTO>> getMyTickets() {

        return ResponseEntity.ok(this.ticketService.getMyTickets());
    }

    @PreAuthorize("hasAnyRole('TECHNICAL', 'CUSTOMER')")
    @GetMapping("/ticketDetails/{ticketId}")
    public ResponseEntity<TicketDetailsResponseDTO> viewTicketDetails(@PathVariable UUID ticketId) {

        return ResponseEntity.ok(this.ticketService.viewTicketsDetails(ticketId));
    }
}
