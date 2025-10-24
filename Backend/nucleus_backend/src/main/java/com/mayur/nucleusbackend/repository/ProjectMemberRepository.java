package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.ProjectMember;
import com.mayur.nucleusbackend.enums.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);
    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByUserId(Long userId);
    List<ProjectMember> findByRole(ProjectRole role);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role = :role")
    List<ProjectMember> findByProjectIdAndRole(@Param("projectId") Long projectId, @Param("role") ProjectRole role);

    @Query("SELECT COUNT(pm) FROM ProjectMember pm WHERE pm.project.id = :projectId")
    long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pm.role FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.user.id = :userId")
    Optional<ProjectRole> findUserRoleInProject(@Param("projectId") Long projectId, @Param("userId") Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    @Query("DELETE FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.user.id = :userId")
    void deleteByProjectIdAndUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);
}