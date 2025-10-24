package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.ProjectMember;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.repository.ProjectMemberRepository;
import com.mayur.nucleusbackend.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectMemberServiceImpl implements ProjectMemberService {

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Override
    public ProjectMember addMemberToProject(Project project, User user, ProjectRole role) {
        // Check if user is already a member
        if (projectMemberRepository.existsByProjectIdAndUserId(project.getId(), user.getId())) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(user);
        projectMember.setRole(role);

        return projectMemberRepository.save(projectMember);
    }

    @Override
    public void removeMemberFromProject(Long projectId, Long userId) {
        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public void updateMemberRole(Long projectId, Long userId, ProjectRole newRole) {
        ProjectMember projectMember = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Project member not found"));

        projectMember.setRole(newRole);
        projectMemberRepository.save(projectMember);
    }

    @Override
    public List<ProjectMember> getProjectMembers(Long projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    @Override
    public List<User> getProjectUsers(Long projectId) {
        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);
        return members.stream()
                .map(ProjectMember::getUser)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectMember> getUserProjects(Long userId) {
        return projectMemberRepository.findByUserId(userId);
    }

    @Override
    public boolean isUserMemberOfProject(Long userId, Long projectId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public ProjectRole getUserRoleInProject(Long userId, Long projectId) {
        return projectMemberRepository.findUserRoleInProject(projectId, userId)
                .orElse(ProjectRole.VIEWER);
    }

    @Override
    public long countProjectMembers(Long projectId) {
        return projectMemberRepository.countByProjectId(projectId);
    }

    @Override
    public List<ProjectMember> getProjectMembersByRole(Long projectId, ProjectRole role) {
        return projectMemberRepository.findByProjectIdAndRole(projectId, role);
    }
}