package com.progressboard.identity.dto;

public record LoginResponseDto(
		String accessToken,
		String refreshToken,
		String tokenType) {
}