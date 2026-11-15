package com.progressboard.projects.dto.requests;

import java.util.Set;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateProjectDto(@NotBlank String title, @NotNull UUID managerId, Set<UUID> participants) {

}
