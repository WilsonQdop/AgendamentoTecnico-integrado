package br.com.Wilson.AgendamentoTecnico.model;

import br.com.Wilson.AgendamentoTecnico.model.enums.StatusEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class TicketHistory {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Ticket ticket;

    @Enumerated(EnumType.STRING)
    private StatusEnum oldStatus; // Novo campo

    @Enumerated(EnumType.STRING)
    private StatusEnum newStatus; // Novo campo

    private LocalDateTime changeDate;
    private String comment;

    private String updateBy;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public StatusEnum getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(StatusEnum oldStatus) {
        this.oldStatus = oldStatus;
    }

    public StatusEnum getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(StatusEnum newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    public void setChangeDate(LocalDateTime changeDate) {
        this.changeDate = changeDate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }
}
