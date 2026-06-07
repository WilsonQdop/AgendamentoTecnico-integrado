package br.com.Wilson.AgendamentoTecnico.model;

import br.com.Wilson.AgendamentoTecnico.model.enums.CategoryEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.PriorityEnum;
import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Customer customer;
    @ManyToOne
    private Technical technical;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TicketHistory> ticketHistories = new ArrayList<>();

    private String title;
    private String description;
    private BigDecimal value;
    private boolean paymentConfirmed;

    @Enumerated(EnumType.STRING)
    private CategoryEnum category;
    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    @Enumerated(EnumType.STRING)
    private PriorityEnum priority;

    private LocalDateTime createdAt;
    private LocalDateTime finishedAt;
    private LocalDateTime startedAt;

    BigDecimal baseHourlyRate = BigDecimal.valueOf(100);

    public List<TicketHistory> getTicketHistories() {
        return ticketHistories;
    }

    public void setTicketHistories(List<TicketHistory> ticketHistories) {
        this.ticketHistories = ticketHistories;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Technical getTechnical() {
        return technical;
    }

    public void setTechnical(Technical technical) {
        this.technical = technical;
    }

    public BigDecimal getBaseHourlyRate() {
        return baseHourlyRate;
    }

    public void setBaseHourlyRate(BigDecimal baseHourlyRate) {
        this.baseHourlyRate = baseHourlyRate;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public PriorityEnum getPriority() {
        return priority;
    }

    public void setPriority(PriorityEnum priority) {
        this.priority = priority;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public boolean isPaymentConfirmed() {
        return paymentConfirmed;
    }

    public void setPaymentConfirmed(boolean paymentConfirmed) {
        this.paymentConfirmed = paymentConfirmed;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
