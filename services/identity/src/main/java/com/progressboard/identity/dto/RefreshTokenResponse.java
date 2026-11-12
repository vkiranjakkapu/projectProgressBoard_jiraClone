package com.progressboard.identity.dto;

public record RefreshTokenResponse(
		String accessToken,
		String refreshToken) {
}
