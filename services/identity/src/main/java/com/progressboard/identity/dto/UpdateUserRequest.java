package com.progressboard.identity.dto;

import java.time.LocalDate;

import com.progressboard.identity.enums.UserGender;

import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
		@NotNull String firstName,
		@NotNull String lastName,
		@NotNull String phone,
		@NotNull UserGender gender,
		LocalDate dob,
		AddressDto address,
		Boolean enabled) {
}
