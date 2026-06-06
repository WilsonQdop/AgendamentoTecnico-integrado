package br.com.Wilson.AgendamentoTecnico.services;

import br.com.Wilson.AgendamentoTecnico.dto.*;
import br.com.Wilson.AgendamentoTecnico.dto.request.UpdateCustomerRequestDTO;
import br.com.Wilson.AgendamentoTecnico.exceptions.CustomerNotFoundByEmailException;
import br.com.Wilson.AgendamentoTecnico.exceptions.PasswordRecentlyUsedException;
import br.com.Wilson.AgendamentoTecnico.model.Customer;
import br.com.Wilson.AgendamentoTecnico.model.PasswordHistory;
import br.com.Wilson.AgendamentoTecnico.model.enums.AuditAction;
import br.com.Wilson.AgendamentoTecnico.repositories.CustomerRepository;
import br.com.Wilson.AgendamentoTecnico.repositories.PasswordHistoryRepository;
import br.com.Wilson.AgendamentoTecnico.utils.AuthUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cglib.core.Local;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtil authUtil;
    private final AuditService auditService;

    public CustomerService(CustomerRepository customerRepository, PasswordHistoryRepository passwordHistoryRepository,
                           PasswordEncoder passwordEncoder, AuthUtil authUtil, AuditService auditService) {
        this.customerRepository = customerRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.authUtil = authUtil;
        this.auditService = auditService;
    }

    public CustomerResponseDTO findCustomerByEmail (String email) {

        return this.customerRepository.findByEmail(email).
                map(customer -> new CustomerResponseDTO(customer.getName(), customer.getEmail(),
                        customer.getPhone(), customer.getRole()))
                .orElseThrow(() -> new CustomerNotFoundByEmailException(email));
    }

    public UpdateCustomerResponseDTO updateCustomer(UpdateCustomerRequestDTO request) {
        Customer customer = (Customer) this.authUtil.getUserLoggedIn();

        // Verifica histórico de senhas
        List<PasswordHistory> history = passwordHistoryRepository
                .findTop3ByPersonOrderByCreatedAtDesc(customer);

        boolean recentlyUsed = history.stream()
                .anyMatch(h -> passwordEncoder.matches(request.password(), h.getHashedPassword()));

        if (recentlyUsed) {
            throw new PasswordRecentlyUsedException();
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        customer.setName(request.name());
        customer.setPhone(request.phone());
        customer.setPassword(encodedPassword);

        Customer newSaved = customerRepository.save(customer);

        // Salva a nova senha no histórico
        passwordHistoryRepository.save(new PasswordHistory(customer, encodedPassword));

        auditService.log(
                AuditAction.USER_UPDATED,
                customer.getName(),
                "Cliente ' " + customer.getName() + "' atualizou seus dados com sucesso"
                );

        return new UpdateCustomerResponseDTO(newSaved.getName(), newSaved.getEmail(),
                newSaved.getPhone());
    }

    public void customerDeleteAccount() {
        Customer customer = (Customer) authUtil.getUserLoggedIn();
        this.customerRepository.delete(customer);

        auditService.log(
                AuditAction.USER_DELETED,
                customer.getName(),
                "Usuário com o email '" + customer.getEmail() +"' foi deletado"
        );



    }
}