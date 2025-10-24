package com.mayur.nucleusbackend.dto.response;

import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrganizationResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private UserResponse createdBy;
    private Instant createdAt;
    private Long projectCount;
}