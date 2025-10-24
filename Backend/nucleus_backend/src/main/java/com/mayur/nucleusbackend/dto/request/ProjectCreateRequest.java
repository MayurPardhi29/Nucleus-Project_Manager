package com.mayur.nucleusbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectCreateRequest {
    @NotBlank @Size(max=100)
    private String name;
    @Size(max=500)
    private String description;
    private String key;
    private Long organizationId;
    private Boolean isPrivate;
}
