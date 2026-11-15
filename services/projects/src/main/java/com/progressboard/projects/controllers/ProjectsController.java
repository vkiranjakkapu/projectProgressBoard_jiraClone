package com.progressboard.projects.controllers;

import java.util.List;
import java.util.UUID;

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
import com.progressboard.projects.dto.requests.CreateProjectDto;
import com.progressboard.projects.dto.requests.UpdateProjectDto;
import com.progressboard.projects.dto.responses.ProjectResponseDto;
import com.progressboard.projects.services.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("projects/api/v1")
@RequiredArgsConstructor
public class ProjectsController {

	private final ProjectService projectService;

	@GetMapping("/")
	public ResponseEntity<ApiResponseDto<List<ProjectResponseDto>>> getAllProjects() {
		return ResponseEntity
				.ok(ApiResponseDto.<List<ProjectResponseDto>>builder().data(
						projectService.getAllProjects().stream()
								.map(prj -> projectService.mapToResponse(prj)).toList())
						.build());
	}

	@GetMapping("/{projectId}")
	public ResponseEntity<ApiResponseDto<ProjectResponseDto>> getProjectById(@PathVariable Long projectId) {
		return ResponseEntity
				.ok(ApiResponseDto.<ProjectResponseDto>builder()
						.data(projectService.mapToResponse(
								projectService.getProjectById(projectId)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PostMapping("/")
	public ResponseEntity<ApiResponseDto<ProjectResponseDto>> createProject(
			@Valid @RequestBody CreateProjectDto request) {
		return ResponseEntity
				.ok(ApiResponseDto.<ProjectResponseDto>builder()
						.data(projectService
								.mapToResponse(projectService.createProject(request)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PutMapping("/")
	public ResponseEntity<ApiResponseDto<ProjectResponseDto>> updateProject(
			@Valid @RequestBody UpdateProjectDto request) {
		return ResponseEntity
				.ok(ApiResponseDto.<ProjectResponseDto>builder()
						.data(projectService
								.mapToResponse(projectService.updateProject(request)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PutMapping("/{projectId}/participant/{memberId}")
	public ResponseEntity<ApiResponseDto<ProjectResponseDto>> addParticipant(@PathVariable Long projectId,
			@PathVariable UUID memberId) {
		return ResponseEntity
				.ok(ApiResponseDto.<ProjectResponseDto>builder()
						.data(projectService.mapToResponse(
								projectService.addParticipant(projectId, memberId)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@DeleteMapping("/{projectId}/participant/{memberId}")
	public ResponseEntity<ApiResponseDto<ProjectResponseDto>> removeParticipant(@PathVariable Long projectId,
			@PathVariable UUID memberId) {
		return ResponseEntity
				.ok(ApiResponseDto.<ProjectResponseDto>builder()
						.data(projectService.mapToResponse(
								projectService.removeParticipant(projectId, memberId)))
						.build());
	}

	@PreAuthorize("hasRole('MANAGER')")
	@DeleteMapping("/{projectId}")
	public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
		projectService.deleteProject(projectId);
		return ResponseEntity.noContent().build();
	}

}
