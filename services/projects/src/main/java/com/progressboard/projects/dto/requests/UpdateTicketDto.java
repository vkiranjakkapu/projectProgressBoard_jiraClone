package com.progressboard.projects.dto.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record UpdateTicketDto(
        @NotBlank Long ticketId,
        @Min(0) @Max(10) Integer storyPoints,
        String description) {

}
