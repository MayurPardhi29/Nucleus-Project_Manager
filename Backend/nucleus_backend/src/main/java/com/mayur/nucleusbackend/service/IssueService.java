package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.enums.IssueType;
import com.mayur.nucleusbackend.enums.IssuePriority;

import java.util.List;
import java.util.Optional;

public interface IssueService {

    List<Issue> getAllIssues();
    Optional<Issue> getIssueById(Long id);
    Optional<Issue> getIssueByKey(String key);
    Issue createIssue(Issue issue, User reporter);
    Issue updateIssue(Long id, Issue issue);
    Issue partialUpdateIssue(Long id, Issue issue);
    void deleteIssue(Long id);
    void softDeleteIssue(Long id);
    List<Issue> getIssuesByProject(Long projectId);
    List<Issue> getIssuesByStatus(IssueStatus status);
    List<Issue> getIssuesByType(IssueType type);
    List<Issue> getIssuesByPriority(IssuePriority priority);
    List<Issue> getIssuesAssignedToUser(Long userId);
    List<Issue> getIssuesReportedByUser(Long userId);
    List<Issue> getAccessibleIssuesForUser(Long userId);
    List<Issue> getProjectIssuesByStatus(Long projectId, IssueStatus status);
    long countIssuesByProject(Long projectId);
    long countIssuesByProjectAndStatus(Long projectId, IssueStatus status);

    // Advanced operations
    Issue changeIssueStatus(Long issueId, IssueStatus newStatus, User changedBy);
    Issue assignIssueToUser(Long issueId, User assignee, User assignedBy);
    Issue addTimeSpent(Long issueId, Integer minutes, User loggedBy);
    List<Issue> getSubTasks(Long parentIssueId);
    Issue createSubTask(Issue subTask, Long parentIssueId, User reporter);
}