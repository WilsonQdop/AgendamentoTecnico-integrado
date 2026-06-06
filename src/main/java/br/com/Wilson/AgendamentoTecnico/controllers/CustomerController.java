package br.com.Wilson.AgendamentoTecnico.controllers;

import br.com.Wilson.AgendamentoTecnico.dto.*;
import br.com.Wilson.AgendamentoTecnico.dto.request.UpdateCustomerRequestDTO;
import br.com.Wilson.AgendamentoTecnico.services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Stream;

@RestController
@RequestMapping("/customer")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/find")
    public ResponseEntity<CustomerResponseDTO> findByEmail(@RequestParam String email) {

        CustomerResponseDTO customer = this.customerService.findCustomerByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(customer);
    }

    @PutMapping("/update")
    public ResponseEntity<UpdateCustomerResponseDTO> updateCustomer (@RequestBody @Valid UpdateCustomerRequestDTO request) {

        UpdateCustomerResponseDTO customer = this.customerService.updateCustomer(request);
        return ResponseEntity.status(HttpStatus.OK).body(customer);

    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> customerDeleteAccount() {
        this.customerService.customerDeleteAccount();

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
