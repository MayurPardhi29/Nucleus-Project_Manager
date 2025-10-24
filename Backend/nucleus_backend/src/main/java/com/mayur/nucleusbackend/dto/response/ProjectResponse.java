package com.mayur.nucleusbackend.dto.response;

import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String key;
    private OrganizationResponse organization;
    private UserResponse owner;
    private Boolean isPrivate;
    private Instant createdAt;
    private Instant updatedAt;
    private Long issueCount;
    private Long memberCount;
}
