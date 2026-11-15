package com.progressboard.projects.dto.responses;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDto {
	private Long id;
	private String title;
	private ParticipantResponseDto manager;
	private Set<UUID> participants;
	private List<Long> tickets;
	private LocalDateTime updatedAt;
	private Instant createdAt;

}
