package com.progressboard.projects.dto.requests;

import com.progressboard.projects.enums.TicketType;

import jakarta.validation.constraints.NotBlank;

public record CreateTicketDto(
        @NotBlank String description,
        @NotBlank int storyPoints,
        @NotBlank Long projectId,
        @NotBlank TicketType type) {

}
