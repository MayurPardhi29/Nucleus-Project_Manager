package com.mayur.nucleusbackend.dto.response;

import com.mayur.nucleusbackend.enums.UserRole;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private UserRole role;
    private Boolean isActive;
    private Instant lastLoginAt;
    private Instant createdAt;
}