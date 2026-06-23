package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.DashboardResponse;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.service.DashboardService;
import com.mayur.nucleusbackend.service.PermissionService;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserService userService;

    @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getUserDashboard(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            DashboardResponse dashboard = dashboardService.getUserDashboard(currentUser.getId());

            return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched successfully", dashboard));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch dashboard data: " + e.getMessage()));
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<DashboardResponse>> getProjectDashboard(
            @PathVariable Long projectId,
            Authentication authentication) {
        try {
            String username = authentication.getName();

            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!permissionService.canViewProject(
                    currentUser.getId(),
                    projectId
            )) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied"));
            }
            DashboardResponse dashboard = dashboardService.getProjectDashboard(projectId);

            return ResponseEntity.ok(ApiResponse.success("Project dashboard data fetched successfully", dashboard));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch project dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<ApiResponse<DashboardResponse>> getOrganizationDashboard(
            @PathVariable Long organizationId,
            Authentication authentication) {
        try {

            String username = authentication.getName();

            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!permissionService.canViewOrganization(
                    currentUser.getId(),
                    organizationId
            )) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied"));
            }

            DashboardResponse dashboard =
                    dashboardService.getOrganizationDashboard(organizationId);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Organization dashboard data fetched successfully",
                            dashboard
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(
                            "Failed to fetch organization dashboard: "
                                    + e.getMessage()
                    ));
        }
    }
}