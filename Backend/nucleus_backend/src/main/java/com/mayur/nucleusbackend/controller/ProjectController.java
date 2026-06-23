package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.AddMemberRequest;
import com.mayur.nucleusbackend.dto.request.ProjectCreateRequest;
import com.mayur.nucleusbackend.dto.request.ProjectUpdateRequest;
import com.mayur.nucleusbackend.dto.response.*;
import com.mayur.nucleusbackend.entity.Organization;
import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectMemberService projectMemberService;

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Project> projects;
            // Show only accessible projects for the user
            projects = projectService.getProjectsByUser(currentUser.getId());

            List<ProjectResponse> responses = projects.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Projects fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch projects: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can view this project
            if (!permissionService.canViewProject(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to this project"));
            }

            Project project = projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            return ResponseEntity.ok(ApiResponse.success("Project fetched successfully", convertToResponse(project)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectByKey(@PathVariable String key, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Project project = projectService.getProjectByKey(key)
                    .orElseThrow(() -> new RuntimeException("Project not found with key: " + key));

            // Check if user can view this project
            if (!permissionService.canViewProject(currentUser.getId(), project.getId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to this project"));
            }

            return ResponseEntity.ok(ApiResponse.success("Project fetched successfully", convertToResponse(project)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @RequestBody ProjectCreateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationService.getOrganizationById(request.getOrganizationId())
                    .orElseThrow(() -> new RuntimeException("Organization not found with id: " + request.getOrganizationId()));

            // Use the permission service to check if user can create project
            if (!permissionService.canCreateProject(currentUser.getId(), organization.getId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to create projects in this organization"));
            }

            Project project = new Project();
            project.setName(request.getName());
            project.setDescription(request.getDescription());
            project.setKey(request.getKey());
            project.setOrganization(organization);
            project.setOwner(currentUser);
            project.setIsPrivate(request.getIsPrivate() != null ? request.getIsPrivate() : false);

            Project savedProject = projectService.createProject(project, currentUser);

            // Auto-add owner as project admin
            projectMemberService.addMemberToProject(savedProject, currentUser, ProjectRole.PROJECT_ADMIN);

            ProjectResponse projectResponse = convertToResponse(savedProject);
            return ResponseEntity.ok(ApiResponse.success("Project created successfully", projectResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create project: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectUpdateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can edit this project
            if (!permissionService.canEditProject(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to edit this project"));
            }

            Project projectUpdate = new Project();
            projectUpdate.setName(request.getName());
            projectUpdate.setDescription(request.getDescription());
            projectUpdate.setKey(request.getKey());
            projectUpdate.setIsPrivate(request.getIsPrivate());

            Project updatedProject = projectService.updateProject(id, projectUpdate);

            return ResponseEntity.ok(ApiResponse.success("Project updated successfully", convertToResponse(updatedProject)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update project: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> partialUpdateProject(
            @PathVariable Long id,
            @RequestBody ProjectUpdateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can edit this project
            if (!permissionService.canEditProject(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to edit this project"));
            }

            Project projectUpdate = new Project();
            projectUpdate.setName(request.getName());
            projectUpdate.setDescription(request.getDescription());
            projectUpdate.setKey(request.getKey());
            projectUpdate.setIsPrivate(request.getIsPrivate());

            Project updatedProject = projectService.partialUpdateProject(id, projectUpdate);

            return ResponseEntity.ok(ApiResponse.success("Project updated successfully", convertToResponse(updatedProject)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update project: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can delete this project
            if (!permissionService.canDeleteProject(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to delete this project"));
            }

            projectService.archiveProject(id);
            return ResponseEntity.ok(ApiResponse.success("Project archived successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete project: " + e.getMessage()));
        }
    }

    // Project Member Management Endpoints

    @GetMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(
            @PathVariable Long projectId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can view this project
            if (!permissionService.canViewProject(currentUser.getId(), projectId)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to this project"));
            }

            List<ProjectMemberResponse> members = projectMemberService.getProjectMembers(projectId).stream()
                    .map(member -> {
                        ProjectMemberResponse response = new ProjectMemberResponse();
                        response.setId(member.getId());
                        response.setRole(member.getRole());
                        response.setAssignedAt(member.getAssignedAt());

                        // Convert user to UserResponse
                        User user = member.getUser();
                        UserResponse userResponse = new UserResponse(
                                user.getId(), user.getUsername(), user.getEmail(),
                                user.getDisplayName(), user.getRole(), user.getIsActive(),
                                user.getLastLoginAt(), user.getCreatedAt()
                        );
                        response.setUser(userResponse);

                        return response;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Project members fetched successfully", members));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch project members: " + e.getMessage()));
        }
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ApiResponse<String>> addProjectMember(
            @PathVariable Long projectId,
            @RequestBody AddMemberRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can manage members in this project
            if (!permissionService.canManageMembers(currentUser.getId(), projectId)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to manage members in this project"));
            }

            Project project = projectService.getProjectById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));

            User userToAdd = userService.getUserById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            projectMemberService.addMemberToProject(project, userToAdd, request.getRole());

            return ResponseEntity.ok(ApiResponse.success("Member added to project successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to add member to project: " + e.getMessage()));
        }
    }

    @PutMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<String>> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestBody AddMemberRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can manage members in this project
            if (!permissionService.canManageMembers(currentUser.getId(), projectId)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to manage members in this project"));
            }

            projectMemberService.updateMemberRole(projectId, userId, request.getRole());

            return ResponseEntity.ok(ApiResponse.success("Member role updated successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update member role: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ApiResponse<String>> removeProjectMember(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can manage members in this project
            if (!permissionService.canManageMembers(currentUser.getId(), projectId)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to manage members in this project"));
            }

            projectMemberService.removeMemberFromProject(projectId, userId);

            return ResponseEntity.ok(ApiResponse.success("Member removed from project successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to remove member from project: " + e.getMessage()));
        }
    }

    // Helper method to convert Project entity to ProjectResponse DTO
// Helper method to convert Project entity to ProjectResponse DTO
    private ProjectResponse convertToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        response.setKey(project.getKey());
        response.setIsPrivate(project.getIsPrivate());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());

        // Set organization - FIXED
        if (project.getOrganization() != null) {
            Organization org = project.getOrganization();
            OrganizationResponse orgResponse = new OrganizationResponse();
            orgResponse.setId(org.getId());
            orgResponse.setName(org.getName());
            orgResponse.setSlug(org.getSlug());
            response.setOrganization(orgResponse);
        }

        // Set owner - FIXED
        if (project.getOwner() != null) {
            User owner = project.getOwner();
            UserResponse ownerResponse = new UserResponse();
            ownerResponse.setId(owner.getId());
            ownerResponse.setUsername(owner.getUsername());
            ownerResponse.setEmail(owner.getEmail());
            ownerResponse.setDisplayName(owner.getDisplayName());
            ownerResponse.setRole(owner.getRole());
            response.setOwner(ownerResponse);
        }

        // Set member count
        response.setMemberCount(projectMemberService.countProjectMembers(project.getId()));

        // Set issue count - temporarily set to 0
        response.setIssueCount(0L); // You can implement this later

        return response;
    }
}