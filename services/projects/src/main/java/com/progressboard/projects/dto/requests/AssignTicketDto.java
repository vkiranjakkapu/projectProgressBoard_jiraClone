package com.progressboard.projects.dto.requests;

import java.util.UUID;

public record AssignTicketDto(Long projectId, Long ticketId, UUID memberId) {

}
