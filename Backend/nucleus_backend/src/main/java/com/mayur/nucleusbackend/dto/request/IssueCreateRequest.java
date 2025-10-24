package com.mayur.nucleusbackend.dto.request;

import com.mayur.nucleusbackend.enums.IssuePriority;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.enums.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IssueCreateRequest {
    private String title;
    private String description;
    private IssueType type;
    private IssueStatus status;
    private IssuePriority priority;
    private Long projectId;
    private Long assigneeId;
    private Integer storyPoints;
    private Integer timeEstimate;
    private Long parentIssueId;
}
