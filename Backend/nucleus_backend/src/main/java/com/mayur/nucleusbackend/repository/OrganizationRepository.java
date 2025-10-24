package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findBySlug(String slug);
    List<Organization> findByCreatedById(Long createdById);

    @Query("SELECT o FROM Organization o WHERE o.deletedAt IS NULL")
    List<Organization> findAllActive();

    @Query("SELECT o FROM Organization o WHERE o.id IN (SELECT p.organization.id FROM Project p WHERE p.id = :projectId)")
    Optional<Organization> findByProjectId(@Param("projectId") Long projectId);

    boolean existsBySlug(String slug);

    @Query("SELECT COUNT(o) FROM Organization o WHERE o.deletedAt IS NULL")
    long countActiveOrganizations();
}