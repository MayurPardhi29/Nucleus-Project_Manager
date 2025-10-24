package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.UserCreateRequest;
import com.mayur.nucleusbackend.dto.request.UserUpdateRequest;
import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            List<UserResponse> userResponses = users.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", userResponses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            return ResponseEntity.ok(ApiResponse.success("User fetched successfully", convertToResponse(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody UserCreateRequest request) {
        try {
            // Let the service handle all the validation and creation logic
            UserResponse savedUser = userService.createUser(request);

            return ResponseEntity.ok(ApiResponse.success("User created successfully", savedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create user: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            // Convert UserUpdateRequest to User entity
            User userUpdate = new User();
            userUpdate.setUsername(request.getUsername());
            userUpdate.setEmail(request.getEmail());
            userUpdate.setDisplayName(request.getDisplayName());
            userUpdate.setRole(request.getRole());
            userUpdate.setIsActive(request.getIsActive());

            User updatedUser = userService.updateUser(id, userUpdate);

            return ResponseEntity.ok(ApiResponse.success("User updated successfully", convertToResponse(updatedUser)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update user: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> partialUpdateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        try {
            // Convert UserUpdateRequest to User entity
            User userUpdate = new User();
            userUpdate.setUsername(request.getUsername());
            userUpdate.setEmail(request.getEmail());
            userUpdate.setDisplayName(request.getDisplayName());
            userUpdate.setRole(request.getRole());
            userUpdate.setIsActive(request.getIsActive());

            User updatedUser = userService.partialUpdateUser(id, userUpdate);

            return ResponseEntity.ok(ApiResponse.success("User updated successfully", convertToResponse(updatedUser)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update user: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        try {
            userService.softDeleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }

    // Helper method to convert User entity to UserResponse DTO
    private UserResponse convertToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getIsActive(),
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}