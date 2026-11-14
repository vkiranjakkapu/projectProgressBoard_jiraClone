package com.progressboard.projects.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.progressboard.projects.models.Project;

public interface ProjectsRepository extends JpaRepository<Project, Long> {

}
