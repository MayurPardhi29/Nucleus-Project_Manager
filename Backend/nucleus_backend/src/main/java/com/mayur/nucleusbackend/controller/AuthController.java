package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.LoginRequest;
import com.mayur.nucleusbackend.dto.request.UserCreateRequest;
import com.mayur.nucleusbackend.dto.request.ForgotPasswordRequest;
import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.AuthResponse;
import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.service.UserService;
import com.mayur.nucleusbackend.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Check if user exists and is active before authentication
            User user = userService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!user.isActive()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Your account has been deactivated. Please contact administrator."));
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.generateToken(authentication);
            User authenticatedUser = (User) authentication.getPrincipal();

            // FIX: Add email parameter to AuthResponse constructor
            AuthResponse authResponse = new AuthResponse(
                    token,
                    jwtTokenProvider.getExpiration(),
                    authenticatedUser.getUsername(),
                    authenticatedUser.getEmail(), // Add this line
                    authenticatedUser.getRole()
            );

            // Update last login time
            updateLastLogin(authenticatedUser);

            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));

        } catch (DisabledException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Your account has been deactivated. Please contact administrator."));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid username or password"));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            // Validate passwords match
            if (!forgotPasswordRequest.getNewPassword().equals(forgotPasswordRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("New password and confirm password do not match"));
            }

            // Validate password length
            if (forgotPasswordRequest.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Password must be at least 6 characters long"));
            }

            // Update password
            userService.updatePassword(
                    forgotPasswordRequest.getUsername(),
                    forgotPasswordRequest.getNewPassword()
            );

            return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password reset failed: " + e.getMessage()));
        }
    }

    private void updateLastLogin(User user) {
        user.setLastLoginAt(Instant.now());
        userService.partialUpdateUser(user.getId(), user);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody UserCreateRequest userCreateRequest) {
        try {
            // Check if user already exists
            if (userService.existsByUsername(userCreateRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Username already exists"));
            }

            if (userService.existsByEmail(userCreateRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email already exists"));
            }

            // Create user using the service
            UserResponse createdUser = userService.createUser(userCreateRequest);

            return ResponseEntity.ok(ApiResponse.success("User registered successfully", createdUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        try {
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Logout failed: " + e.getMessage()));
        }
    }
}