package com.progressboard.projects.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.progressboard.projects.models.Comment;

public interface CommentsRepository extends JpaRepository<Comment, Long> {

}
