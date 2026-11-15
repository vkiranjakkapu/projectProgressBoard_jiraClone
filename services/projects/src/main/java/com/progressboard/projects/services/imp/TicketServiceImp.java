package com.progressboard.projects.services.imp;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.progressboard.projects.dto.requests.AssignTicketDto;
import com.progressboard.projects.dto.requests.CreateTicketDto;
import com.progressboard.projects.dto.requests.UpdateTicketDto;
import com.progressboard.projects.dto.responses.TicketResponseDto;
import com.progressboard.projects.enums.BusinessErrors;
import com.progressboard.projects.exceptions.BusinessException;
import com.progressboard.projects.exceptions.SecurityException;
import com.progressboard.projects.models.Assignee;
import com.progressboard.projects.models.Comment;
import com.progressboard.projects.models.Project;
import com.progressboard.projects.models.Ticket;
import com.progressboard.projects.repositories.TicketsRepository;
import com.progressboard.projects.services.CurrentUserService;
import com.progressboard.projects.services.ProjectService;
import com.progressboard.projects.services.TicketService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketServiceImp implements TicketService {

    private final TicketsRepository ticketsRepository;

    private final CurrentUserService currentUser;
    private final ProjectService projectService;

    @Override
    @Transactional(readOnly = true)
    public List<Ticket> getAllTicketsByProjectId(Long projectId) {
        return ticketsRepository.findAllByProject(Project.builder().id(projectId).build());
    }

    @Override
    @Transactional(readOnly = true)
    public Ticket getTicketById(Long ticketId) {
        return ticketsRepository.findById(ticketId).orElseThrow(
                () -> new BusinessException(BusinessErrors.RESOURCE_NOT_FOUND, "No ticket found with given Id."));
    }

    @Override
    @Transactional
    public Ticket createTicket(CreateTicketDto request) {
        Project project = projectService.getProjectById(request.projectId());
        requiresManager(project);

        return ticketsRepository.save(Ticket.builder()
                .description(request.description())
                .storyPoints(request.storyPoints())
                .type(request.type())
                .project(project)
                .creatorId(currentUser.userId())
                .creatorName(currentUser.username())
                .build());
    }

    @Override
    @Transactional
    public Ticket updateTicket(UpdateTicketDto request) {
        Ticket ticket = getTicketById(request.ticketId());

        requiresManager(ticket.getProject());

        Optional.ofNullable(request.description()).ifPresent(description -> ticket.setDescription(description));
        Optional.ofNullable(request.storyPoints()).ifPresent(storyPoints -> ticket.setStoryPoints(storyPoints));

        return ticketsRepository.save(ticket);
    }

    @Override
    public Ticket assignTicket(AssignTicketDto request) {
        Project project = projectService.getProjectById(request.projectId());

        requiresManager(project);
        requiresParticipant(project, request.memberId());

        Ticket ticket = getTicketById(request.ticketId());

        ticket.setAllAssignees(ticket.getAllAssignees().stream().map(a -> {
            a.setActive(false);
            return a;
        }).collect(Collectors.toSet()));

        Assignee assignee = Assignee.builder().ticket(ticket).memberId(request.memberId()).build();

        ticket.getAllAssignees().add(assignee);

        return ticketsRepository.save(ticket);

    }

    @Override
    @Transactional
    public void deleteTicket(Long ticketId) {
        ticketsRepository.deleteById(ticketId);
    }

    @Override
    public TicketResponseDto mapToResponse(Ticket ticket) {
        TicketResponseDto response = TicketResponseDto.builder()
                .id(ticket.getId())
                .description(ticket.getDescription())
                .storyPoints(ticket.getStoryPoints())
                .project(ticket.getProject())
                .creatorId(ticket.getCreatorId())
                .creatorName(ticket.getCreatorName())
                .assignedTo(ticket.getAssignedTo())
                .allAssignees(ticket.getAllAssignees())
                .type(ticket.getType())
                .comments(ticket.getComments().stream().map(Comment::getId).toList())
                .updatedAt(ticket.getUpdatedAt())
                .createdAt(ticket.getCreatedAt())
                .build();

        return response;
    }

    private void requiresManager(Project project) {
        if (!currentUser.userId().equals(project.getManagerId())) {
            throw new SecurityException(BusinessErrors.FORBIDDEN, "Only Managers can perform this operation.");
        }
    }

    private void requiresParticipant(Project project, UUID memberId) {
        if (!project.getParticipants().contains(memberId)) {
            throw new BusinessException(BusinessErrors.INVALID_PARTICIPANT, "Member doesn't belong to this project.",
                    HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
