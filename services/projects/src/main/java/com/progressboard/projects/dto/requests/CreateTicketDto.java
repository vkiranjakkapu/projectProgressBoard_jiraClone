package com.progressboard.projects.dto.requests;

import com.progressboard.projects.enums.TicketType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateTicketDto(
		@NotBlank String description,
		@NotBlank @Min(0) @Max(10) int storyPoints,
		@NotBlank Long projectId,
		@NotBlank TicketType type) {

}
