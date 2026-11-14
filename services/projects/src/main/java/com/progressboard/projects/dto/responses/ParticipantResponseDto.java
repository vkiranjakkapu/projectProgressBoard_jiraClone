package com.progressboard.projects.dto.responses;

import java.util.UUID;

import com.progressboard.projects.dto.UserResponseDto;

import lombok.Builder;

@Builder
public record ParticipantResponseDto(UUID id, String name, String email, String phone) {

    public ParticipantResponseDto(UserResponseDto user) {
        this(user.id(), user.firstName() + " " + user.lastName(), user.email(), user.phone());
    }

}
