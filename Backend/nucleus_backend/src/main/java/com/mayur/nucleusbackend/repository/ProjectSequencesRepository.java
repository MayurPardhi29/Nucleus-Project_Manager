package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.ProjectSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectSequencesRepository extends JpaRepository<ProjectSequence, Long> {

    Optional<ProjectSequence> findByProjectId(Long projectId);

    @Modifying
    @Query("UPDATE ProjectSequence ps SET ps.nextIssueNumber = ps.nextIssueNumber + 1 WHERE ps.projectId = :projectId")
    void incrementNextIssueNumber(@Param("projectId") Long projectId);

    @Query("SELECT ps.nextIssueNumber FROM ProjectSequence ps WHERE ps.projectId = :projectId")
    Integer findNextIssueNumberByProjectId(@Param("projectId") Long projectId);

    @Modifying
    @Query(value = "INSERT INTO project_sequences (project_id, next_issue_number) VALUES (:projectId, 1) ON CONFLICT (project_id) DO NOTHING", nativeQuery = true)
    void initializeSequence(@Param("projectId") Long projectId);
}