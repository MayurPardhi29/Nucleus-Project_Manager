package com.mayur.nucleusbackend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectUpdateRequest {
    @Size(max=100)
    private String name;
    @Size(max=500)
    private String description;
    private String key;
    private Boolean isPrivate;
}
