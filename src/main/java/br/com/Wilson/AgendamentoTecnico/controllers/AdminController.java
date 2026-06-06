package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.*;
import br.com.Wilson.AgendamentoTecnico.dto.request.CustomerRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTechnicalRequestDTO;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.services.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Stream;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("technical/create")
    public ResponseEntity<CreateTechnicalResponseDTO> createTechnical (@RequestBody @Valid CreateTechnicalRequestDTO request) {
        CreateTechnicalResponseDTO technical = this.adminService.createTechnical(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(technical);
    }

    @DeleteMapping("/customer/delete/{id}")
    public ResponseEntity<Void> deleteCustomer (@PathVariable UUID id) {
        this.adminService.deleteCustomer(id);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/technical/delete/{id}")
    public ResponseEntity<Void> deleteTechnical (@PathVariable UUID id) {
        this.adminService.deleteTechnical(id);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/technical/findAll")
    public ResponseEntity<Stream<TechnicalResponseDTO>> getAllTechnical () {
        Stream<TechnicalResponseDTO> technical = this.adminService.getAllTechnical();

        return ResponseEntity.status(HttpStatus.OK).body(technical);
    }

    @GetMapping("/customer/findAll")
    public ResponseEntity<Stream<CustomerResponseDTO>> getAllCustomers () {
        Stream<CustomerResponseDTO> customer = this.adminService.getAllCustomers();

        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @PatchMapping("/customer/update/{id}")
    public ResponseEntity<UpdateCustomerResponseDTO> updateCustomer (@RequestBody @Valid CustomerRequestDTO request, @PathVariable UUID id) {
        UpdateCustomerResponseDTO customer = this.adminService.updateCustomer(request, id);

        return ResponseEntity.status(HttpStatus.OK).body(customer);

    }
    @PatchMapping("/technical/update/{id}")
    public ResponseEntity<UpdateTechnicalResponseDTO> updateCustomer (@RequestBody @Valid CreateTechnicalRequestDTO request, @PathVariable UUID id) {
        UpdateTechnicalResponseDTO customer = this.adminService.updateTechnical(request, id);

        return ResponseEntity.status(HttpStatus.OK).body(customer);

    }

}
