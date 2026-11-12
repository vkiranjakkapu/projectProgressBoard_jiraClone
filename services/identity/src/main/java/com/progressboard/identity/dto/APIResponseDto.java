package com.progressboard.identity.dto;

import java.time.LocalDateTime;

import com.progressboard.identity.enums.ResponseStatus;

import lombok.Builder;

@Builder
public record APIResponseDto<T>(ResponseStatus status, T data, LocalDateTime timestamp) {

    public APIResponseDto {
        if (status == null) {
            status = ResponseStatus.SUCCESS;
        }
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
