package com.progressboard.projects.dto;

import java.time.Instant;

import lombok.Builder;

@Builder
public record ApiResponseDto<T>(T data, Instant timeStamp) {

}
