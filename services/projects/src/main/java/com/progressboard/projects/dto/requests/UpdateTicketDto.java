package com.progressboard.projects.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record UpdateTicketDto(@NotBlank Long ticketId, int storyPoints, String description) {

}
