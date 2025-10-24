package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	Optional<Project> findByKey(String key);
	List<Project> findByOrganizationId(Long organizationId);
	List<Project> findByOwnerId(Long ownerId);
	List<Project> findByIsPrivateFalse();

	@Query("SELECT p FROM Project p WHERE p.archivedAt IS NULL")
	List<Project> findAllActive();

	@Query("SELECT p FROM Project p WHERE p.organization.id = :organizationId AND p.archivedAt IS NULL")
	List<Project> findActiveByOrganizationId(@Param("organizationId") Long organizationId);

	@Query("SELECT p FROM Project p WHERE p.id IN (SELECT pm.project.id FROM ProjectMember pm WHERE pm.user.id = :userId) AND p.archivedAt IS NULL")
	List<Project> findProjectsByUserId(@Param("userId") Long userId);

	@Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR p.id IN (SELECT pm.project.id FROM ProjectMember pm WHERE pm.user.id = :userId AND pm.role = 'ADMIN')")
	List<Project> findAdminProjectsByUserId(@Param("userId") Long userId);

	boolean existsByKey(String key);

	@Query("SELECT COUNT(p) FROM Project p WHERE p.archivedAt IS NULL")
	long countActiveProjects();
}