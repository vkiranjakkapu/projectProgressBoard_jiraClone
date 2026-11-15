package com.progressboard.projects.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestResponseDto<T> {

    private T data;

    @Builder.Default()
    private LocalDateTime timestamp = LocalDateTime.now();
}