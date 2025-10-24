package com.mayur.nucleusbackend.dto.response;

import com.mayur.nucleusbackend.enums.IssuePriority;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.enums.IssueType;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueResponse {
    private Long id;
    private String key;
    private String title;
    private String description;
    private IssueType type;
    private IssueStatus status;
    private IssuePriority priority;
    private ProjectResponse project;
    private UserResponse reporter;
    private UserResponse assignee;
    private Integer storyPoints;
    private Integer timeEstimate;
    private Integer timeSpent;
    private Instant createdAt;
    private Instant updatedAt;
    private Long commentCount;
}
