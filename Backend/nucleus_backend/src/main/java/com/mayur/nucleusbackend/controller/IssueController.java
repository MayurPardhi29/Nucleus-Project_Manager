package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.IssueCreateRequest;
import com.mayur.nucleusbackend.dto.request.IssueUpdateRequest;
import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.IssueResponse;
import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.service.IssueService;
import com.mayur.nucleusbackend.service.PermissionService;
import com.mayur.nucleusbackend.service.ProjectService;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IssueResponse>>> getAllIssues(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get only accessible issues for the user
            List<Issue> issues = issueService.getAccessibleIssuesForUser(currentUser.getId());

            List<IssueResponse> responses = issues.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Issues fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch issues: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> getIssueById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can view this issue
            if (!permissionService.canViewIssue(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to this issue"));
            }

            Issue issue = issueService.getIssueById(id)
                    .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

            return ResponseEntity.ok(ApiResponse.success("Issue fetched successfully", convertToResponse(issue)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<ApiResponse<IssueResponse>> getIssueByKey(@PathVariable String key, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Issue issue = issueService.getIssueByKey(key)
                    .orElseThrow(() -> new RuntimeException("Issue not found with key: " + key));

            // Check if user can view this issue
            if (!permissionService.canViewIssue(currentUser.getId(), issue.getId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to this issue"));
            }

            return ResponseEntity.ok(ApiResponse.success("Issue fetched successfully", convertToResponse(issue)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<IssueResponse>>> searchIssuesByStatus(
            @RequestParam String status,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            IssueStatus issueStatus = IssueStatus.valueOf(status.toUpperCase());
            List<Issue> issues = issueService.getIssuesByStatus(issueStatus);

            // Filter only accessible issues
            List<Issue> accessibleIssues = issues.stream()
                    .filter(issue -> permissionService.canViewIssue(currentUser.getId(), issue.getId()))
                    .collect(Collectors.toList());

            List<IssueResponse> responses = accessibleIssues.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Issues filtered by status", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search issues: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IssueResponse>> createIssue(
            @RequestBody IssueCreateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can create issues in this project
            if (!permissionService.canCreateIssue(currentUser.getId(), request.getProjectId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to create issues in this project"));
            }

            Project project = projectService.getProjectById(request.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));

            Issue issue = new Issue();
            issue.setTitle(request.getTitle());
            issue.setDescription(request.getDescription());
            issue.setType(request.getType());
            issue.setStatus(request.getStatus() != null ? request.getStatus() : IssueStatus.OPEN);
            issue.setPriority(request.getPriority() != null ? request.getPriority() : com.mayur.nucleusbackend.enums.IssuePriority.MEDIUM);
            issue.setProject(project);
            issue.setStoryPoints(request.getStoryPoints());
            issue.setTimeEstimate(request.getTimeEstimate());

            // Set assignee if provided
            if (request.getAssigneeId() != null) {
                User assignee = userService.getUserById(request.getAssigneeId())
                        .orElseThrow(() -> new RuntimeException("Assignee not found"));
                issue.setAssignee(assignee);
            }

            Issue savedIssue = issueService.createIssue(issue, currentUser);

            return ResponseEntity.ok(ApiResponse.success("Issue created successfully", convertToResponse(savedIssue)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create issue: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> updateIssue(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can edit this issue
            if (!permissionService.canEditIssue(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to edit this issue"));
            }

            Issue issueUpdate = new Issue();
            issueUpdate.setTitle(request.getTitle());
            issueUpdate.setDescription(request.getDescription());
            issueUpdate.setType(request.getType());
            issueUpdate.setStatus(request.getStatus());
            issueUpdate.setPriority(request.getPriority());
            issueUpdate.setStoryPoints(request.getStoryPoints());
            issueUpdate.setTimeEstimate(request.getTimeEstimate());
            issueUpdate.setTimeSpent(request.getTimeSpent());

            if (request.getAssigneeId() != null) {

                if (!permissionService.canAssignIssue(currentUser.getId(), id)) {
                    return ResponseEntity.status(403)
                            .body(ApiResponse.error("Access denied to assign issue"));
                }

                User assignee = userService.getUserById(request.getAssigneeId())
                        .orElseThrow(() -> new RuntimeException("Assignee not found"));

                issueUpdate.setAssignee(assignee);
            }

            Issue updatedIssue = issueService.updateIssue(id, issueUpdate);

            return ResponseEntity.ok(ApiResponse.success("Issue updated successfully", convertToResponse(updatedIssue)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update issue: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> partialUpdateIssue(
            @PathVariable Long id,
            @RequestBody IssueUpdateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can edit this issue
            if (!permissionService.canEditIssue(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to edit this issue"));
            }

            Issue issueUpdate = new Issue();
            issueUpdate.setTitle(request.getTitle());
            issueUpdate.setDescription(request.getDescription());
            issueUpdate.setType(request.getType());
            issueUpdate.setStatus(request.getStatus());
            issueUpdate.setPriority(request.getPriority());
            issueUpdate.setStoryPoints(request.getStoryPoints());
            issueUpdate.setTimeEstimate(request.getTimeEstimate());
            issueUpdate.setTimeSpent(request.getTimeSpent());

            if (request.getAssigneeId() != null) {

                if (!permissionService.canAssignIssue(currentUser.getId(), id)) {
                    return ResponseEntity.status(403)
                            .body(ApiResponse.error("Access denied to assign issue"));
                }

                User assignee = userService.getUserById(request.getAssigneeId())
                        .orElseThrow(() -> new RuntimeException("Assignee not found"));

                issueUpdate.setAssignee(assignee);
            }

            Issue updatedIssue = issueService.partialUpdateIssue(id, issueUpdate);

            return ResponseEntity.ok(ApiResponse.success("Issue updated successfully", convertToResponse(updatedIssue)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update issue: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteIssue(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can delete this issue
            if (!permissionService.canDeleteIssue(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to delete this issue"));
            }

            issueService.softDeleteIssue(id);
            return ResponseEntity.ok(ApiResponse.success("Issue deleted successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete issue: " + e.getMessage()));
        }
    }

    private UserResponse convertUser(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    // Helper method to convert Issue entity to IssueResponse DTO
    private IssueResponse convertToResponse(Issue issue) {
        IssueResponse response = new IssueResponse();
        response.setId(issue.getId());
        response.setKey(issue.getKey());
        response.setTitle(issue.getTitle());
        response.setDescription(issue.getDescription());
        response.setType(issue.getType());
        response.setStatus(issue.getStatus());
        response.setPriority(issue.getPriority());
        response.setStoryPoints(issue.getStoryPoints());
        response.setTimeEstimate(issue.getTimeEstimate());
        response.setTimeSpent(issue.getTimeSpent());
        response.setCreatedAt(issue.getCreatedAt());
        response.setUpdatedAt(issue.getUpdatedAt());

        response.setReporter(convertUser(issue.getReporter()));
        response.setAssignee(convertUser(issue.getAssignee()));

        return response;
    }
}