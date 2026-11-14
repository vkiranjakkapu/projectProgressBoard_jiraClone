package com.progressboard.projects.services;

import java.util.List;

import com.progressboard.projects.dto.requests.AssignTicketDto;
import com.progressboard.projects.dto.requests.CreateTicketDto;
import com.progressboard.projects.dto.requests.UpdateTicketDto;
import com.progressboard.projects.dto.responses.TicketResponseDto;
import com.progressboard.projects.models.Ticket;

public interface TicketService {

    List<Ticket> getAllTicketsByProjectId(Long projectId);

    Ticket getTicketById(Long ticketId);

    Ticket createTicket(CreateTicketDto request);

    Ticket updateTicket(UpdateTicketDto request);

    Ticket assignTicket(AssignTicketDto request);

    void deleteTicket(Long ticketId);

    TicketResponseDto mapToResponse(Ticket ticket);

}