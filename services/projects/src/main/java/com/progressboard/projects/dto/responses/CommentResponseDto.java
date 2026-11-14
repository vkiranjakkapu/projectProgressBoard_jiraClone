package com.progressboard.projects.dto.responses;

import java.time.Instant;

public record CommentResponseDto(
        Long id,
        ParticipantResponseDto commentor,
        TicketResponseDto ticket,
        String comment,
        Instant createdAt) {

}
