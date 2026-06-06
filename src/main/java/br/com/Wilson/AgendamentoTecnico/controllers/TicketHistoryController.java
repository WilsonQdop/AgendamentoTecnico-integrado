package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.TicketDetailsResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.TicketHistoryResponseDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.TicketHistoryRequestDTO;
import br.com.Wilson.AgendamentoTecnico.model.TicketHistory;
import br.com.Wilson.AgendamentoTecnico.services.TicketHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

    @RestController
    @RequestMapping("/history")
    @PreAuthorize("hasRole('TECHNICAL')")
    public class TicketHistoryController {

        private final TicketHistoryService ticketHistoryService;

        public TicketHistoryController(TicketHistoryService ticketHistoryService) {
            this.ticketHistoryService = ticketHistoryService;
        }

        @PutMapping("/change/{id}")
        public ResponseEntity<TicketHistoryResponseDTO> changeTicketHistory (@RequestBody TicketHistoryRequestDTO request, @PathVariable UUID id) {

            return ResponseEntity.ok(this.ticketHistoryService.ChangeTicketHistory(request, id));

        }
    }
