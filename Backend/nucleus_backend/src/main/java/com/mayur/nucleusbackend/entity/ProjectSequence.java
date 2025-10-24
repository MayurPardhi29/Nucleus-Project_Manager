package com.mayur.nucleusbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_sequences")
public class ProjectSequence {

    @Id
    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "next_issue_number", nullable = false)
    private Integer nextIssueNumber = 1;

    // Constructors
    public ProjectSequence() {}

    public ProjectSequence(Long projectId) {
        this.projectId = projectId;
        this.nextIssueNumber = 1;
    }

    public ProjectSequence(Long projectId, Integer nextIssueNumber) {
        this.projectId = projectId;
        this.nextIssueNumber = nextIssueNumber;
    }

    // Getters and Setters
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Integer getNextIssueNumber() { return nextIssueNumber; }
    public void setNextIssueNumber(Integer nextIssueNumber) { this.nextIssueNumber = nextIssueNumber; }
}