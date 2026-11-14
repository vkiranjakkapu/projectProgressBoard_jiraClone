package com.progressboard.projects.dto.responses;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.progressboard.projects.enums.TicketType;
import com.progressboard.projects.models.Assignee;
import com.progressboard.projects.models.Project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponseDto {
	private Long id;
	private String description;
	private int storyPoints;
	private Project project;
	private UUID creatorId;
	private String creatorName;
	private Assignee assignedTo;
	private Set<Assignee> allAssignees;
	private TicketType type;
	private List<Long> comments;
	private LocalDateTime updatedAt;
	private Instant createdAt;

}
