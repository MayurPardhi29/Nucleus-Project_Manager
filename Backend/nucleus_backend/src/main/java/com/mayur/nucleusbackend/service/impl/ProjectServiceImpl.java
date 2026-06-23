package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.repository.ProjectMemberRepository;
import com.mayur.nucleusbackend.repository.ProjectRepository;
import com.mayur.nucleusbackend.service.AuditLogService;
import com.mayur.nucleusbackend.service.PermissionService;
import com.mayur.nucleusbackend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Override
    public Optional<Project> getProjectByKey(String key) {
        return projectRepository.findByKey(key);
    }

    @Override
    public Project createProject(Project project, User owner) {
        Project savedProject = projectRepository.save(project);

        auditLogService.logAction(
                "PROJECT_CREATED",
                "Created project: " + savedProject.getKey(),
                owner
        );
        return savedProject;
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setKey(project.getKey());
        existingProject.setIsPrivate(project.getIsPrivate());

        return projectRepository.save(existingProject);
    }

    @Override
    public Project partialUpdateProject(Long id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        if (project.getName() != null) existingProject.setName(project.getName());
        if (project.getDescription() != null) existingProject.setDescription(project.getDescription());
        if (project.getKey() != null) existingProject.setKey(project.getKey());
        if (project.getIsPrivate() != null) existingProject.setIsPrivate(project.getIsPrivate());

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public void archiveProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setArchivedAt(Instant.now());
        projectRepository.save(project);
    }

    @Override
    public void restoreProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setArchivedAt(null);
        projectRepository.save(project);
    }

    @Override
    public List<Project> getProjectsByOrganization(Long organizationId) {
        return projectRepository.findByOrganizationId(organizationId);
    }

    @Override
    public List<Project> getProjectsByUser(Long userId) {
        return projectRepository.findProjectsByUserId(userId);
    }

    @Override
    public List<Project> getAdminProjectsByUser(Long userId) {
        return projectRepository.findAdminProjectsByUserId(userId);
    }

    @Override
    public List<Project> getActiveProjects() {
        return projectRepository.findAllActive();
    }

    @Override
    public boolean existsByKey(String key) {
        return projectRepository.existsByKey(key);
    }

    @Override
    public long countActiveProjects() {
        return projectRepository.countActiveProjects();
    }

    @Override
    public boolean canUserViewProject(Long userId, Long projectId) {
        return permissionService.canViewProject(userId, projectId);
    }

    @Override
    public boolean canUserEditProject(Long userId, Long projectId) {
        return permissionService.canEditProject(userId, projectId);
    }

    @Override
    public boolean canUserAdminProject(Long userId, Long projectId) {
        return permissionService.canAdminProject(userId, projectId);
    }

    @Override
    public ProjectRole getUserProjectRole(Long userId, Long projectId) {
        return permissionService.getUserProjectRole(userId, projectId);
    }
}