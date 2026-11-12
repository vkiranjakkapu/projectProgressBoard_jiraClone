package com.progressboard.identity.services;

import com.progressboard.identity.dto.LoginRequestDto;
import com.progressboard.identity.dto.LoginResponseDto;
import com.progressboard.identity.dto.LogoutRequestDto;
import com.progressboard.identity.dto.RefreshTokenRequest;
import com.progressboard.identity.dto.RefreshTokenResponse;

public interface AuthenticationService {

    LoginResponseDto login(LoginRequestDto request);

    RefreshTokenResponse refresh(RefreshTokenRequest request);

    void logout(LogoutRequestDto request);

}