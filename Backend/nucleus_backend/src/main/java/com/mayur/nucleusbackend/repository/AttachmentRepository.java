package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

	List<Attachment> findByIssueId(Long issueId);

	@Query("SELECT a FROM Attachment a WHERE a.issue.id = :issueId ORDER BY a.uploadedAt DESC")
	List<Attachment> findByIssueIdOrderByUploadedAtDesc(@Param("issueId") Long issueId);

	@Query("SELECT COUNT(a) FROM Attachment a WHERE a.issue.id = :issueId")
	long countByIssueId(@Param("issueId") Long issueId);

	@Query("SELECT SUM(a.fileSize) FROM Attachment a WHERE a.issue.id = :issueId")
	Long getTotalSizeByIssueId(@Param("issueId") Long issueId);

	@Query("DELETE FROM Attachment a WHERE a.issue.id = :issueId")
	void deleteByIssueId(@Param("issueId") Long issueId);

	List<Attachment> findByFileNameContainingIgnoreCase(String fileName);
}