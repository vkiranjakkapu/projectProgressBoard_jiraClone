package com.progressboard.identity.dto;

import java.time.LocalDate;

import com.progressboard.identity.entities.RoleType;
import com.progressboard.identity.enums.UserGender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateUserRequestDto(
		@NotNull RoleType role,
		@Email @NotBlank String email,
		@NotBlank String phone,

		@NotBlank String firstName,
		@NotBlank String lastName,
		@NotNull UserGender gender,

		String password,
		LocalDate dob,
		AddressDto address) {
}