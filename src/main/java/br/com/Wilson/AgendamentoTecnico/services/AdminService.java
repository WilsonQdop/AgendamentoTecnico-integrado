package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.*;
import br.com.Wilson.AgendamentoTecnico.dto.request.CustomerRequestDTO;
import br.com.Wilson.AgendamentoTecnico.dto.request.CreateTechnicalRequestDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.*;
import br.com.Wilson.AgendamentoTecnico.model.Customer;
import br.com.Wilson.AgendamentoTecnico.model.Technical;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.model.enums.Role;
import br.com.Wilson.AgendamentoTecnico.repositories.CustomerRepository;
import br.com.Wilson.AgendamentoTecnico.repositories.TechnicalRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final TechnicalRepository technicalRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AdminService(CustomerRepository customerRepository, TechnicalRepository technicalRepository,
                        PasswordEncoder passwordEncoder,  AuditService auditService) {
        this.customerRepository = customerRepository;
        this.technicalRepository = technicalRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public CreateTechnicalResponseDTO createTechnical (CreateTechnicalRequestDTO request) {
        Technical technical = new Technical();

        if (this.technicalRepository.existsByEmail(request.email())) { // Verificar email duplicado
            throw new EmailAlreadyInUseException();
        }

        if (!request.password().equals(request.passwordConfirmed())) {
            throw new PasswordsDoNotMatchException();
        }
        technical.setName(request.name());
        technical.setEmail(request.email());
        technical.setPhone(request.phone());
        technical.setPassword(passwordEncoder.encode(request.password()));
        technical.setRole(Role.TECHNICAL);

        Technical saved = this.technicalRepository.save(technical);

        auditService.log(
                AuditAction.USER_CREATED,
                saved.getEmail(),
                "Técnico com o email '" + saved.getEmail() + "' foi criado com sucesso pelo Admin"
        );

        return new CreateTechnicalResponseDTO(saved.getName(), saved.getEmail(), saved.getPhone(),  saved.getRole());
    }

    public void deleteCustomer (UUID id) {
        Customer customer = this.findCustomerById(id);

        this.customerRepository.delete(customer);
    }

    public void deleteTechnical(UUID id) {
        Technical technical =this.findTechnicalById(id);

        this.technicalRepository.delete(technical);
    }

    public Stream<TechnicalResponseDTO> getAllTechnical () {
        List<Technical> technicalList = this.technicalRepository.findAll();
        return technicalList.stream()
                .map(t -> new TechnicalResponseDTO(t.getName(), t.getEmail(), t.getPhone(), t.getRole()));
    }

    public Stream<CustomerResponseDTO> getAllCustomers () {
        List<Customer> customerList = this.customerRepository.findAll();
        return customerList.stream()
                .map(c -> new CustomerResponseDTO(c.getName(), c.getEmail(), c.getPhone(), c.getRole()));
    }

    public UpdateCustomerResponseDTO updateCustomer (CustomerRequestDTO request, UUID id) {
        Customer customer = this.findCustomerById(id);
        customer.setName(request.name());
        customer.setPhone(request.phone());
        customer.setPassword(passwordEncoder.encode(request.password()));
        Customer newSaved = customerRepository.save(customer);

        return new UpdateCustomerResponseDTO(newSaved.getName(), newSaved.getEmail(), newSaved.getPhone());
    }

    public UpdateTechnicalResponseDTO updateTechnical (CreateTechnicalRequestDTO request, UUID id) {
        Technical technical = this.technicalRepository.findById(id).orElseThrow
                (() -> new TechnicalNotFoundException(id));
        technical.setName(request.name());
        technical.setPhone(request.phone());

        if (request.password() != null && !request.password().isEmpty()) {
            if (!request.password().equals(request.passwordConfirmed())) {
                throw new PasswordsDoNotMatchException();
            }

            technical.setPassword(passwordEncoder.encode(request.password()));
        }

        Technical saved = this.technicalRepository.save(technical);

        auditService.log(
                AuditAction.USER_UPDATED,
                saved.getEmail(),
                "Dados do técnico '" + saved.getName() + "' atualizados pelo Admin"
        );

        return new UpdateTechnicalResponseDTO(saved.getName(), saved.getEmail(), saved.getPhone());

    }
        private Customer findCustomerById (UUID id) {
            return  this.customerRepository.findById(id).orElseThrow
                    (() -> new CustomerNotFoundByIdException(id));
        }
    private Technical findTechnicalById (UUID id) {
        return  this.technicalRepository.findById(id).orElseThrow
                (() -> new TechnicalNotFoundException(id));
    }

}
