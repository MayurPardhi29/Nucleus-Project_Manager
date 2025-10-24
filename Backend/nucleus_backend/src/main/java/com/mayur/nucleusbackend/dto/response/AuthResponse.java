package com.mayur.nucleusbackend.dto.response;

import com.mayur.nucleusbackend.enums.UserRole;

public class AuthResponse {
    private String token;
    private Long expiresIn;
    private String username;
    private String email; // Make sure this field exists
    private UserRole role;

    // Constructor with all parameters including email
    public AuthResponse(String token, Long expiresIn, String username, String email, UserRole role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    // Default constructor
    public AuthResponse() {}

    // Getters and setters for ALL fields
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}