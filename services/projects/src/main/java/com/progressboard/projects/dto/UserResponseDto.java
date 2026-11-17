package com.progressboard.projects.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.progressboard.projects.enums.RoleType;
import com.progressboard.projects.enums.UserGender;

import lombok.Builder;

@Builder
public record UserResponseDto(UUID id,
		String email,
		String firstName,
		String lastName,
		String phone,
		LocalDate dob,
		UserGender gender,
		AddressDto address,
		boolean enabled,
		Set<RoleType> roles,
		LocalDateTime createdAt,
		LocalDateTime updatedAt) {
}