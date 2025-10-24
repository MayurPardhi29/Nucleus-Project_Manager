package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.ProjectRole;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

    List<Project> getAllProjects();
    Optional<Project> getProjectById(Long id);
    Optional<Project> getProjectByKey(String key);
    Project createProject(Project project, User owner);
    Project updateProject(Long id, Project project);
    Project partialUpdateProject(Long id, Project project);
    void deleteProject(Long id);
    void archiveProject(Long id);
    void restoreProject(Long id);
    List<Project> getProjectsByOrganization(Long organizationId);
    List<Project> getProjectsByUser(Long userId);
    List<Project> getAdminProjectsByUser(Long userId);
    List<Project> getActiveProjects();
    boolean existsByKey(String key);
    long countActiveProjects();

    // Permission related methods
    boolean canUserViewProject(Long userId, Long projectId);
    boolean canUserEditProject(Long userId, Long projectId);
    boolean canUserAdminProject(Long userId, Long projectId);
    ProjectRole getUserProjectRole(Long userId, Long projectId);
}