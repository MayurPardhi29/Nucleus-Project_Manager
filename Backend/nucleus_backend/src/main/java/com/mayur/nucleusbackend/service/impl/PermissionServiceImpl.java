package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.*;
import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.enums.UserRole;
import com.mayur.nucleusbackend.repository.*;
import com.mayur.nucleusbackend.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PermissionServiceImpl implements PermissionService {

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public boolean canCreateProject(Long userId, Long organizationId) {
        if (isGlobalAdmin(userId)) return true;
        if (isOrganizationAdmin(userId, organizationId)) return true;
        return false;
    }

    @Override
    public boolean canViewProject(Long userId, Long projectId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty() || project.get().getArchivedAt() != null) return false;

        if (!project.get().getIsPrivate()) return true;

        return isUserMemberOfProject(userId, projectId);
    }

    @Override
    public boolean canEditProject(Long userId, Long projectId) {
        if (isGlobalAdmin(userId)) return true;
        if (isUserProjectOwner(userId, projectId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN;
    }

    @Override
    public boolean canAdminProject(Long userId, Long projectId) {
        if (isGlobalAdmin(userId)) return true;
        if (isUserProjectOwner(userId, projectId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN;
    }

    @Override
    public boolean canDeleteProject(Long userId, Long projectId) {
        return isUserProjectOwner(userId, projectId) || isGlobalAdmin(userId);
    }

    @Override
    public boolean canCreateIssue(Long userId, Long projectId) {
        if (isGlobalAdmin(userId)) return true;

        Long organizationId = getOrganizationIdFromProject(projectId);
        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN || role == ProjectRole.DEVELOPER;
    }

    @Override
    public boolean canViewIssue(Long userId, Long issueId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty() || issue.get().getDeletedAt() != null) return false;

        Long projectId = issue.get().getProject().getId();
        Long organizationId = getOrganizationIdFromProject(projectId);

        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        return isUserMemberOfProject(userId, projectId);
    }

    @Override
    public boolean canEditIssue(Long userId, Long issueId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty() || issue.get().getDeletedAt() != null) return false;

        Long projectId = issue.get().getProject().getId();
        Long organizationId = getOrganizationIdFromProject(projectId);

        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);

        if (role == ProjectRole.PROJECT_ADMIN) return true;

        if (role == ProjectRole.DEVELOPER) {
            return isUserIssueReporter(userId, issueId) || isUserIssueAssignee(userId, issueId);
        }

        return false;
    }

    @Override
    public boolean canDeleteIssue(Long userId, Long issueId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty()) return false;

        Long projectId = issue.get().getProject().getId();
        Long organizationId = getOrganizationIdFromProject(projectId);

        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN;
    }

    @Override
    public boolean canAssignIssue(Long userId, Long issueId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty()) return false;

        Long projectId = issue.get().getProject().getId();
        Long organizationId = getOrganizationIdFromProject(projectId);

        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN;
    }

    @Override
    public boolean canViewComments(Long userId, Long issueId) {
        return canViewIssue(userId, issueId);
    }

    @Override
    public boolean canCreateComment(Long userId, Long issueId) {
        if (!canViewIssue(userId, issueId)) return false;

        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty()) return false;

        Long projectId = issue.get().getProject().getId();
        ProjectRole role = getUserProjectRole(userId, projectId);

        return role != ProjectRole.VIEWER;
    }

    @Override
    public boolean canEditComment(Long userId, Long commentId) {
        if (isGlobalAdmin(userId)) return true;

        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isEmpty()) return false;

        if (isUserCommentAuthor(userId, commentId)) {
            return isCommentWithinEditWindow(commentId);
        }

        Long issueId = comment.get().getIssue().getId();
        Optional<Issue> issue = issueRepository.findById(issueId);
        if (issue.isEmpty()) return false;

        Long projectId = issue.get().getProject().getId();
        Long organizationId = getOrganizationIdFromProject(projectId);

        if (organizationId != null && isOrganizationAdmin(userId, organizationId)) return true;

        ProjectRole role = getUserProjectRole(userId, projectId);
        return role == ProjectRole.PROJECT_ADMIN;
    }

    @Override
    public boolean canDeleteComment(Long userId, Long commentId) {
        return canEditComment(userId, commentId);
    }

    @Override
    public boolean canManageMembers(Long userId, Long projectId) {
        return canAdminProject(userId, projectId);
    }

    @Override
    public boolean canInviteMembers(Long userId, Long projectId) {
        return canAdminProject(userId, projectId);
    }

    @Override
    public boolean canRemoveMembers(Long userId, Long projectId) {
        return canAdminProject(userId, projectId);
    }

    @Override
    public ProjectRole getUserProjectRole(Long userId, Long projectId) {
        return projectMemberRepository.findUserRoleInProject(projectId, userId)
                .orElse(ProjectRole.VIEWER);
    }

    @Override
    public boolean isProjectPublic(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.map(p -> !p.getIsPrivate()).orElse(false);
    }

    @Override
    public boolean isUserProjectOwner(Long userId, Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.map(p -> p.getOwner().getId().equals(userId)).orElse(false);
    }

    @Override
    public boolean canViewOrganization(Long userId, Long organizationId) {

        if (isGlobalAdmin(userId)) {
            return true;
        }

        if (isOrganizationAdmin(userId, organizationId)) {
            return true;
        }

        List<Project> projects =
                projectRepository.findByOrganizationId(organizationId);

        return projects.stream()
                .anyMatch(project ->
                        projectMemberRepository.existsByProjectIdAndUserId(
                                project.getId(),
                                userId
                        ));
    }

    private boolean isOrganizationAdmin(Long userId, Long organizationId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) return false;

        // SUPER_ADMIN can admin any organization
        if (user.get().getRole() == UserRole.SUPER_ADMIN) return true;

        // ORG_ADMIN can admin their organizations
        if (user.get().getRole() == UserRole.ORG_ADMIN) {
            // Check if this user created the organization (as per your current structure)
            Optional<Organization> organization = organizationRepository.findById(organizationId);
            return organization.map(org -> org.getCreatedBy().getId().equals(userId)).orElse(false);
        }

        return false;
    }

    private boolean isGlobalAdmin(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(u -> u.getRole() == UserRole.SUPER_ADMIN).orElse(false);
    }

    private boolean isUserMemberOfProject(Long userId, Long projectId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    private Long getOrganizationIdFromProject(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.map(p -> p.getOrganization().getId()).orElse(null);
    }

    private boolean isUserIssueReporter(Long userId, Long issueId) {
        Optional<Issue> issue = issueRepository.findById(issueId);
        return issue.map(i -> i.getReporter().getId().equals(userId)).orElse(false);
    }

    private boolean isUserIssueAssignee(Long userId, Long issueId) {
        Optional<Issue> issue = issueRepository.findById(issueId);
        return issue.map(i -> i.getAssignee() != null && i.getAssignee().getId().equals(userId)).orElse(false);
    }

    private boolean isUserCommentAuthor(Long userId, Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        return comment.map(c -> c.getAuthor().getId().equals(userId)).orElse(false);
    }

    private boolean isCommentWithinEditWindow(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            Instant createdAt = comment.get().getCreatedAt();
            Instant now = Instant.now();
            return Duration.between(createdAt, now).toMinutes() <= 15; // 15-minute edit window
        }
        return false;
    }

    private Long getProjectIdFromIssue(Long issueId) {
        Optional<Issue> issue = issueRepository.findById(issueId);
        return issue.map(i -> i.getProject().getId()).orElse(null);
    }

    private Long getProjectIdFromComment(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        return comment.map(c -> c.getIssue().getProject().getId()).orElse(null);
    }

}