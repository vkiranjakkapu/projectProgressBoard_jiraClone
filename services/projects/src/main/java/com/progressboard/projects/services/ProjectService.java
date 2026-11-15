package com.progressboard.projects.services;

import java.util.List;
import java.util.UUID;

import com.progressboard.projects.dto.requests.CreateProjectDto;
import com.progressboard.projects.dto.requests.UpdateProjectDto;
import com.progressboard.projects.dto.responses.ProjectResponseDto;
import com.progressboard.projects.models.Project;

public interface ProjectService {

    List<Project> getAllProjects();

    Project getProjectById(Long projectId);

    Project createProject(CreateProjectDto request);

    Project saveProject(Project project);

    Project updateProject(UpdateProjectDto request);

    Project saveProjectUpdate(Project project);

    Project addParticipant(Long projectId, UUID memberId);

    Project removeParticipant(Long projectId, UUID memberId);

    void deleteProject(Long projectId);

    ProjectResponseDto mapToResponse(Project project);

}