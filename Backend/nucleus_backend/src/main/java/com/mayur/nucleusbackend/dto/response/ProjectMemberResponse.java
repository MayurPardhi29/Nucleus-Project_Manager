package com.mayur.nucleusbackend.dto.response;

import com.mayur.nucleusbackend.enums.ProjectRole;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMemberResponse {
    private Long id;
    private UserResponse user;
    private ProjectRole role;
    private Instant assignedAt;
}
