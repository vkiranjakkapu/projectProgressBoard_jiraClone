package com.progressboard.projects.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.progressboard.projects.models.Project;
import com.progressboard.projects.models.Ticket;

public interface TicketsRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllByProject(Project project);

}
