package com.progressboard.projects.models;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "projects")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private UUID managerId;

    @Column(nullable = false)
    private String managerName;

    @Column(nullable = false)
    private String managerEmail;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_participants", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "member_id")
    @Builder.Default
    private Set<UUID> participants = new HashSet<>();

    @OneToMany(mappedBy = "project")
    private List<Ticket> tickets;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    private Instant createdAt;

    public void addParticipant(UUID memberId) {
        this.participants.add(memberId);
    }

}
