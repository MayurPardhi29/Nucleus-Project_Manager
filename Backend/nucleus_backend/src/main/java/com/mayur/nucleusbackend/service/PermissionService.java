package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.enums.UserRole;

public interface PermissionService {

    // NEW METHOD: Project creation permission
    boolean canCreateProject(Long userId, Long organizationId);

    // Project permissions
    boolean canViewProject(Long userId, Long projectId);
    boolean canEditProject(Long userId, Long projectId);
    boolean canAdminProject(Long userId, Long projectId);
    boolean canDeleteProject(Long userId, Long projectId);

    // Issue permissions
    boolean canViewIssue(Long userId, Long issueId);
    boolean canCreateIssue(Long userId, Long projectId);
    boolean canEditIssue(Long userId, Long issueId);
    boolean canDeleteIssue(Long userId, Long issueId);
    boolean canAssignIssue(Long userId, Long issueId);

    // Comment permissions
    boolean canViewComments(Long userId, Long issueId);
    boolean canCreateComment(Long userId, Long issueId);
    boolean canEditComment(Long userId, Long commentId);
    boolean canDeleteComment(Long userId, Long commentId);

    // Member management permissions
    boolean canManageMembers(Long userId, Long projectId);
    boolean canInviteMembers(Long userId, Long projectId);
    boolean canRemoveMembers(Long userId, Long projectId);

    // Utility methods
    ProjectRole getUserProjectRole(Long userId, Long projectId);
    boolean isProjectPublic(Long projectId);
    boolean isUserProjectOwner(Long userId, Long projectId);
}