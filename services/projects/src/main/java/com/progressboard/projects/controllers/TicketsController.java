package com.progressboard.projects.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.progressboard.projects.dto.ApiResponseDto;
import com.progressboard.projects.dto.requests.AssignTicketDto;
import com.progressboard.projects.dto.requests.CreateTicketDto;
import com.progressboard.projects.dto.requests.UpdateTicketDto;
import com.progressboard.projects.dto.responses.TicketResponseDto;
import com.progressboard.projects.services.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects/api/v1/tickets")
@RequiredArgsConstructor
public class TicketsController {

	private final TicketService ticketService;

	@GetMapping("/project/{projectId}")
	public ResponseEntity<ApiResponseDto<List<TicketResponseDto>>> getAllTickets(@PathVariable Long projectId) {
		return ResponseEntity.ok(
				ApiResponseDto.<List<TicketResponseDto>>builder()
						.data(ticketService.getAllTicketsByProjectId(projectId)
								.stream().map(tck -> ticketService.mapToResponse(tck))
								.toList())
						.build());
	}

	@GetMapping("/{ticketId}")
	public ResponseEntity<ApiResponseDto<TicketResponseDto>> getTicketById(@PathVariable Long ticketId) {
		return ResponseEntity.ok(
				ApiResponseDto.<TicketResponseDto>builder()
						.data(ticketService
								.mapToResponse(ticketService.getTicketById(ticketId)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PostMapping("/")
	public ResponseEntity<ApiResponseDto<TicketResponseDto>> createTicket(@Valid @RequestBody CreateTicketDto request) {
		return ResponseEntity.ok(
				ApiResponseDto.<TicketResponseDto>builder()
						.data(ticketService.mapToResponse(ticketService.createTicket(request)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PostMapping("/assign")
	public ResponseEntity<ApiResponseDto<TicketResponseDto>> assignTicket(@Valid @RequestBody AssignTicketDto request) {
		return ResponseEntity.ok(
				ApiResponseDto.<TicketResponseDto>builder()
						.data(ticketService.mapToResponse(ticketService.assignTicket(request)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PutMapping("/")
	public ResponseEntity<ApiResponseDto<TicketResponseDto>> updateTicket(@Valid @RequestBody UpdateTicketDto request) {
		return ResponseEntity.ok(
				ApiResponseDto.<TicketResponseDto>builder()
						.data(ticketService.mapToResponse(ticketService.updateTicket(request)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@DeleteMapping("/{ticketId}")
	public ResponseEntity<Void> updateTicket(@PathVariable Long ticketId) {
		ticketService.deleteTicket(ticketId);
		return ResponseEntity.noContent().build();
	}

}
