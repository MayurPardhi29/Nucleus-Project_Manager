package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.enums.IssueType;
import com.mayur.nucleusbackend.enums.IssuePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

	Optional<Issue> findByKey(String key);
	List<Issue> findByProjectId(Long projectId);
	List<Issue> findByReporterId(Long reporterId);
	List<Issue> findByAssigneeId(Long assigneeId);
	List<Issue> findByStatus(IssueStatus status);
	List<Issue> findByType(IssueType type);
	List<Issue> findByPriority(IssuePriority priority);

	@Query("SELECT i FROM Issue i WHERE i.project.id = :projectId AND i.deletedAt IS NULL")
	List<Issue> findActiveByProjectId(@Param("projectId") Long projectId);

	@Query("SELECT i FROM Issue i WHERE i.assignee.id = :userId AND i.deletedAt IS NULL")
	List<Issue> findActiveAssignedToUser(@Param("userId") Long userId);

	@Query("SELECT i FROM Issue i WHERE i.reporter.id = :userId AND i.deletedAt IS NULL")
	List<Issue> findActiveReportedByUser(@Param("userId") Long userId);

	@Query("SELECT i FROM Issue i WHERE i.project.id = :projectId AND i.status = :status AND i.deletedAt IS NULL")
	List<Issue> findByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") IssueStatus status);

	@Query("SELECT i FROM Issue i WHERE i.project.id IN (SELECT pm.project.id FROM ProjectMember pm WHERE pm.user.id = :userId) AND i.deletedAt IS NULL")
	List<Issue> findAccessibleIssuesForUser(@Param("userId") Long userId);

	@Query("SELECT COUNT(i) FROM Issue i WHERE i.project.id = :projectId AND i.deletedAt IS NULL")
	long countActiveByProjectId(@Param("projectId") Long projectId);

	@Query("SELECT COUNT(i) FROM Issue i WHERE i.project.id = :projectId AND i.status = :status AND i.deletedAt IS NULL")
	long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") IssueStatus status);

	@Query("SELECT i FROM Issue i WHERE i.parentIssue.id = :parentIssueId AND i.deletedAt IS NULL")
	List<Issue> findSubTasksByParentId(@Param("parentIssueId") Long parentIssueId);

	boolean existsByKey(String key);
}