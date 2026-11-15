package com.progressboard.projects.dto.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssignTicketDto(@NotBlank Long projectId, @NotBlank Long ticketId, @NotNull UUID memberId) {

}
