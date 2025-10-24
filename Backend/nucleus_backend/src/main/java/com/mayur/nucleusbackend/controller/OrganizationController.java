package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.OrganizationCreateRequest;
import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.OrganizationResponse;
import com.mayur.nucleusbackend.entity.Organization;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.service.OrganizationService;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrganizationResponse>>> getAllOrganizations() {
        try {
            List<Organization> organizations = organizationService.getAllOrganizations();
            List<OrganizationResponse> responses = organizations.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Organizations fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch organizations: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganizationById(@PathVariable Long id) {
        try {
            Organization organization = organizationService.getOrganizationById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

            return ResponseEntity.ok(ApiResponse.success("Organization fetched successfully", convertToResponse(organization)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
            @RequestBody OrganizationCreateRequest request,
            Authentication authentication) {
        try {
            // Get current user from authentication
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = new Organization();
            organization.setName(request.getName());
            organization.setSlug(request.getSlug());
            organization.setDescription(request.getDescription());

            Organization savedOrganization = organizationService.createOrganization(organization, currentUser);

            return ResponseEntity.ok(ApiResponse.success("Organization created successfully", convertToResponse(savedOrganization)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create organization: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrganizationResponse>> updateOrganization(
            @PathVariable Long id,
            @RequestBody OrganizationCreateRequest request) {
        try {
            Organization organizationUpdate = new Organization();
            organizationUpdate.setName(request.getName());
            organizationUpdate.setSlug(request.getSlug());
            organizationUpdate.setDescription(request.getDescription());

            Organization updatedOrganization = organizationService.updateOrganization(id, organizationUpdate);

            return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", convertToResponse(updatedOrganization)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update organization: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteOrganization(@PathVariable Long id) {
        try {
            organizationService.softDeleteOrganization(id);
            return ResponseEntity.ok(ApiResponse.success("Organization deleted successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete organization: " + e.getMessage()));
        }
    }

    // Helper method to convert Organization entity to OrganizationResponse DTO
    private OrganizationResponse convertToResponse(Organization organization) {
        OrganizationResponse response = new OrganizationResponse();
        response.setId(organization.getId());
        response.setName(organization.getName());
        response.setSlug(organization.getSlug());
        response.setDescription(organization.getDescription());
        response.setCreatedAt(organization.getCreatedAt());

        // Convert createdBy user to UserResponse
        if (organization.getCreatedBy() != null) {
            // You would need to create a simple UserResponse conversion here
        }

        return response;
    }
}