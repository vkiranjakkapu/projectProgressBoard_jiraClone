package com.progressboard.projects.services.imp;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.progressboard.projects.dto.UserResponseDto;
import com.progressboard.projects.dto.requests.CreateProjectDto;
import com.progressboard.projects.dto.requests.UpdateProjectDto;
import com.progressboard.projects.dto.responses.ParticipantResponseDto;
import com.progressboard.projects.dto.responses.ProjectResponseDto;
import com.progressboard.projects.enums.BusinessErrors;
import com.progressboard.projects.enums.RoleType;
import com.progressboard.projects.exceptions.BusinessException;
import com.progressboard.projects.exceptions.SecurityException;
import com.progressboard.projects.models.Project;
import com.progressboard.projects.models.Ticket;
import com.progressboard.projects.repositories.ProjectsRepository;
import com.progressboard.projects.services.CurrentUserService;
import com.progressboard.projects.services.IdentityService;
import com.progressboard.projects.services.ProjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImp implements ProjectService {

    private final ProjectsRepository projectsRepository;

    private final CurrentUserService currentUser;
    private final IdentityService identityService;

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long projectId) {
        return projectsRepository.findById(projectId).orElseThrow(
                () -> new BusinessException(BusinessErrors.RESOURCE_NOT_FOUND, "Project with given id not found."));
    }

    @Override
    public Project createProject(CreateProjectDto request) {
        if (!currentUser.isManager()) {
            throw new BusinessException(BusinessErrors.FORBIDDEN, "Only managers can create projects.",
                    HttpStatus.FORBIDDEN);
        }

        Project project = Project.builder()
                .title(request.title())
                .managerId(currentUser.userId())
                .managerName(currentUser.username())
                .managerEmail(currentUser.email())
                .build();

        Optional.ofNullable(request.participants()).ifPresent(participants -> {
            project.setParticipants(participants);
        });

        return saveProject(project);
    }

    @Override
    @Transactional
    public Project saveProject(Project project) {
        return projectsRepository.save(project);
    }

    @Override
    public Project updateProject(UpdateProjectDto request) {
        Project project = getProjectById(request.id());

        requireManager(project);

        Optional.ofNullable(request.title()).ifPresent(title -> project.setTitle(title));
        Optional.ofNullable(request.managerId()).ifPresent(managerId -> {
            UserResponseDto managerDetails = currentUser.userId().equals(managerId) ? UserResponseDto.builder()
                    .id(managerId)
                    .email(currentUser.email())
                    .build()
                    : identityService.getAllUsersByIds(Set.of(request.managerId()))
                            .get(request.managerId());

            if (!currentUser.userId().equals(managerId)) {
                if (!managerDetails.roles().contains(RoleType.MANAGER)) {
                    throw new BusinessException(BusinessErrors.FORBIDDEN,
                            "Member not qualified to be project manager.", HttpStatus.EXPECTATION_FAILED);
                }
            }

            project.setManagerId(managerDetails.id());
            project.setManagerName(currentUser.userId().equals(managerId) ? currentUser.username()
                    : managerDetails.firstName() + " " + managerDetails.lastName());
            project.setManagerEmail(managerDetails.email());
        });

        return saveProjectUpdate(project);
    }

    @Override
    @Transactional
    public Project saveProjectUpdate(Project project) {
        return projectsRepository.save(project);
    }

    @Override
    @Transactional
    public Project addParticipant(Long projectId, UUID memberId) {
        Project project = getProjectById(projectId);

        requireManager(project);

        project.addParticipant(memberId);

        return projectsRepository.save(project);
    }

    @Override
    @Transactional
    public Project removeParticipant(Long projectId, UUID memberId) {
        Project project = getProjectById(projectId);

        requireManager(project);
        requireParticipant(project, memberId);

        project.getParticipants().removeIf(mId -> mId.equals(memberId));

        return projectsRepository.save(project);
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId) {
        requireManager(getProjectById(projectId));
        projectsRepository.deleteById(projectId);
    }

    @Override
    public ProjectResponseDto mapToResponse(Project project) {
        ProjectResponseDto resposne = ProjectResponseDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .tickets(project.getTickets().stream().map(Ticket::getId).toList())
                .updatedAt(project.getUpdatedAt())
                .participants(project.getParticipants())
                .createdAt(project.getCreatedAt())
                .build();

        resposne.setManager(ParticipantResponseDto.builder()
                .id(project.getManagerId())
                .name(project.getManagerName())
                .email(project.getManagerEmail())
                .build());

        return resposne;
    }

    private void requireManager(Project project) {
        if (!project.getManagerId().equals(currentUser.userId())) {
            throw new SecurityException(BusinessErrors.FORBIDDEN, "Only Managers can perform this operation.");
        }
    }

    private void requireParticipant(Project project, UUID memberId) {
        if (!project.getParticipants().contains(memberId)) {
            throw new BusinessException(BusinessErrors.INVALID_PARTICIPANT, "Member doesn't belong to this project.",
                    HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
