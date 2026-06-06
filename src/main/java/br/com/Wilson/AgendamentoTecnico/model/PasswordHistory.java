package br.com.Wilson.AgendamentoTecnico.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class PasswordHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(nullable = false)
    private String hashedPassword;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public PasswordHistory() {}

    public PasswordHistory(Person person, String hashedPassword) {
        this.person = person;
        this.hashedPassword = hashedPassword;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public Person getPerson() { return person; }
    public String getHashedPassword() { return hashedPassword; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}