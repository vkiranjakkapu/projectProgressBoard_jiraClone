package com.progressboard.projects.dto.requests;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public record UpdateProjectDto(
        @NotBlank Long id,
        String title,
        UUID managerId) {

}
