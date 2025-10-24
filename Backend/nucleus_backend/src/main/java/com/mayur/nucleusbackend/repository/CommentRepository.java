package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByIssueId(Long issueId);
	List<Comment> findByAuthorId(Long authorId);

	@Query("SELECT c FROM Comment c WHERE c.issue.id = :issueId ORDER BY c.createdAt DESC")
	List<Comment> findByIssueIdOrderByCreatedAtDesc(@Param("issueId") Long issueId);

	@Query("SELECT COUNT(c) FROM Comment c WHERE c.issue.id = :issueId")
	long countByIssueId(@Param("issueId") Long issueId);

	@Query("DELETE FROM Comment c WHERE c.issue.id = :issueId")
	void deleteByIssueId(@Param("issueId") Long issueId);
}