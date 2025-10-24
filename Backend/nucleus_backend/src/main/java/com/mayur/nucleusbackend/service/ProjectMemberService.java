package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.ProjectMember;
import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.ProjectRole;

import java.util.List;

public interface ProjectMemberService {

    ProjectMember addMemberToProject(Project project, User user, ProjectRole role);
    void removeMemberFromProject(Long projectId, Long userId);
    void updateMemberRole(Long projectId, Long userId, ProjectRole newRole);
    List<ProjectMember> getProjectMembers(Long projectId);
    List<User> getProjectUsers(Long projectId);
    List<ProjectMember> getUserProjects(Long userId);
    boolean isUserMemberOfProject(Long userId, Long projectId);
    ProjectRole getUserRoleInProject(Long userId, Long projectId);
    long countProjectMembers(Long projectId);
    List<ProjectMember> getProjectMembersByRole(Long projectId, ProjectRole role);
}