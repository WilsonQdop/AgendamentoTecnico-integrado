package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.TicketAssignedResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTechnicalRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.UpdateTechnicalResponseDTO;
import br.com.Wilson.AgendamentoTecnico.services.TechnicalService;
import br.com.Wilson.AgendamentoTecnico.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/technical")
@PreAuthorize("hasRole('TECHNICAL')")
public class TechnicalController {

    private final TechnicalService technicalService;
    private final TicketService ticketService;

    public TechnicalController(TechnicalService technicalService, TicketService ticketService) {
        this.technicalService = technicalService;
        this.ticketService = ticketService;
    }

    @DeleteMapping("/delete")

    public ResponseEntity<Void> technicalDeleteAccount () {

        this.technicalService.technicalDeleteAccount();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/update")

    public ResponseEntity<UpdateTechnicalResponseDTO> updateTechnical (@RequestBody @Valid CreateTechnicalRequestDTO request) {

        UpdateTechnicalResponseDTO technical = this.technicalService.updateTechnical(request);
        return ResponseEntity.status(HttpStatus.OK).body(technical);
    }

    @PutMapping("/assign/{ticketId}")
    public ResponseEntity<TicketAssignedResponseDTO> ticketAssigned (@PathVariable UUID ticketId) {
        TicketAssignedResponseDTO ticket = this.ticketService.ticketAssigned(ticketId);

        return ResponseEntity.ok(ticket);
    }
}
