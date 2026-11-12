package com.progressboard.identity.dto;

import com.progressboard.identity.entities.RoleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record RegistrationRequest(@Email String email,
        @NotEmpty String firstName,
        @NotEmpty String lastName,
        @NotEmpty String password,
        @NotEmpty String confirmPassword,
        RoleType type) {

}
