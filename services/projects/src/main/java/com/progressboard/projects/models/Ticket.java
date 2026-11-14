package com.progressboard.projects.models;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.progressboard.projects.enums.TicketType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Max(10)
    @Min(0)
    private int storyPoints = 5;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TicketType type = TicketType.ISSUE;

    @ManyToOne
    private Project project;

    private UUID creatorId;

    private String creatorName;

    @OneToMany(mappedBy = "ticket", orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<Assignee> allAssignees;

    @OneToMany(mappedBy = "ticket", orphanRemoval = true, cascade = { CascadeType.PERSIST, CascadeType.DETACH,
            CascadeType.REFRESH, CascadeType.REMOVE })
    private List<Comment> comments;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreationTimestamp
    private Instant createdAt;

    public UUID getAssignedMember() {
        return this.allAssignees.stream()
                .sorted(Comparator.comparing(Assignee::getCreatedAt, Comparator.reverseOrder()))
                .findFirst().map(a -> a.getMemberId()).orElse(null);
    }

}
