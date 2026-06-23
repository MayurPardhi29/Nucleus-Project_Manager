package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.IssuePriority;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.enums.IssueType;
import com.mayur.nucleusbackend.enums.ProjectRole;
import com.mayur.nucleusbackend.repository.IssueRepository;
import com.mayur.nucleusbackend.service.IssueService;
import com.mayur.nucleusbackend.service.PermissionService;
import com.mayur.nucleusbackend.util.IssueKeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private IssueKeyGenerator issueKeyGenerator;

    @Autowired
    private PermissionService permissionService;

    @Override
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @Override
    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    @Override
    public Optional<Issue> getIssueByKey(String key) {
        return issueRepository.findByKey(key);
    }

    @Override
    public Issue createIssue(Issue issue, User reporter) {

        if (issue.getAssignee() != null) {

            ProjectRole role =
                    permissionService.getUserProjectRole(
                            issue.getAssignee().getId(),
                            issue.getProject().getId()
                    );

            if (role == ProjectRole.VIEWER) {
                throw new RuntimeException(
                        "Viewer cannot be assigned issues"
                );
            }
        }

        if (issue.getKey() == null) {
            String issueKey =
                    issueKeyGenerator.generateIssueKey(
                            issue.getProject().getId()
                    );
            issue.setKey(issueKey);
        }

        issue.setReporter(reporter);

        return issueRepository.save(issue);
    }

    @Override
    public Issue updateIssue(Long id, Issue issue) {

        Issue existingIssue =
                issueRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Issue not found with id: " + id
                                ));

        if(issue.getTitle() != null)
            existingIssue.setTitle(issue.getTitle());

        if(issue.getDescription() != null)
            existingIssue.setDescription(issue.getDescription());

        if(issue.getType() != null)
            existingIssue.setType(issue.getType());

        if(issue.getStatus() != null)
            existingIssue.setStatus(issue.getStatus());

        if(issue.getPriority() != null)
            existingIssue.setPriority(issue.getPriority());

        if (issue.getAssignee() != null) {

            ProjectRole role =
                    permissionService.getUserProjectRole(
                            issue.getAssignee().getId(),
                            existingIssue.getProject().getId()
                    );

            if (role == ProjectRole.VIEWER) {
                throw new RuntimeException(
                        "Viewer cannot be assigned issues"
                );
            }

            existingIssue.setAssignee(issue.getAssignee());
        }

        if(issue.getAssignee() != null)
            existingIssue.setAssignee(issue.getAssignee());

        if(issue.getStoryPoints() != null)
            existingIssue.setStoryPoints(issue.getStoryPoints());

        if(issue.getTimeEstimate() != null)
            existingIssue.setTimeEstimate(issue.getTimeEstimate());

        if(issue.getTimeSpent() != null)
            existingIssue.setTimeSpent(issue.getTimeSpent());

        return issueRepository.save(existingIssue);
    }

    @Override
    public Issue partialUpdateIssue(Long id, Issue issue) {
        Issue existingIssue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        if (issue.getTitle() != null) existingIssue.setTitle(issue.getTitle());
        if (issue.getDescription() != null) existingIssue.setDescription(issue.getDescription());
        if (issue.getType() != null) existingIssue.setType(issue.getType());
        if (issue.getStatus() != null) existingIssue.setStatus(issue.getStatus());
        if (issue.getPriority() != null) existingIssue.setPriority(issue.getPriority());
        if (issue.getAssignee() != null) {

            ProjectRole role =
                    permissionService.getUserProjectRole(
                            issue.getAssignee().getId(),
                            existingIssue.getProject().getId()
                    );

            if (role == ProjectRole.VIEWER) {
                throw new RuntimeException(
                        "Viewer cannot be assigned issues"
                );
            }

            existingIssue.setAssignee(issue.getAssignee());
        }
        if (issue.getAssignee() != null) existingIssue.setAssignee(issue.getAssignee());
        if (issue.getStoryPoints() != null) existingIssue.setStoryPoints(issue.getStoryPoints());
        if (issue.getTimeEstimate() != null) existingIssue.setTimeEstimate(issue.getTimeEstimate());
        if (issue.getTimeSpent() != null) existingIssue.setTimeSpent(issue.getTimeSpent());

        return issueRepository.save(existingIssue);
    }

    @Override
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    @Override
    public void softDeleteIssue(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));
        issue.setDeletedAt(Instant.now());
        issueRepository.save(issue);
    }

    @Override
    public List<Issue> getIssuesByProject(Long projectId) {
        return issueRepository.findActiveByProjectId(projectId);
    }

    @Override
    public List<Issue> getIssuesByStatus(IssueStatus status) {
        return issueRepository.findByStatus(status);
    }

    @Override
    public List<Issue> getIssuesByType(IssueType type) {
        return issueRepository.findByType(type);
    }

    @Override
    public List<Issue> getIssuesByPriority(IssuePriority priority) {
        return issueRepository.findByPriority(priority);
    }

    @Override
    public List<Issue> getIssuesAssignedToUser(Long userId) {
        return issueRepository.findActiveAssignedToUser(userId);
    }

    @Override
    public List<Issue> getIssuesReportedByUser(Long userId) {
        return issueRepository.findActiveReportedByUser(userId);
    }

    @Override
    public List<Issue> getAccessibleIssuesForUser(Long userId) {
        return issueRepository.findAccessibleIssuesForUser(userId);
    }

    @Override
    public List<Issue> getProjectIssuesByStatus(Long projectId, IssueStatus status) {
        return issueRepository.findByProjectIdAndStatus(projectId, status);
    }

    @Override
    public long countIssuesByProject(Long projectId) {
        return issueRepository.countActiveByProjectId(projectId);
    }

    @Override
    public long countIssuesByProjectAndStatus(Long projectId, IssueStatus status) {
        return issueRepository.countByProjectIdAndStatus(projectId, status);
    }

    @Override
    public Issue changeIssueStatus(Long issueId, IssueStatus newStatus, User changedBy) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));

        issue.setStatus(newStatus);
        return issueRepository.save(issue);
    }

    @Override
    public Issue assignIssueToUser(Long issueId, User assignee, User assignedBy) {

        if (!Boolean.TRUE.equals(assignee.getIsActive())
                || assignee.getDeletedAt() != null) {

            throw new RuntimeException(
                    "Cannot assign issue to deleted or inactive user"
            );
        }

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));


        ProjectRole role =
                permissionService.getUserProjectRole(
                        assignee.getId(),
                        issue.getProject().getId()
                );

        if (role == ProjectRole.VIEWER) {
            throw new RuntimeException(
                    "Viewer cannot be assigned issues"
            );
        }

        issue.setAssignee(assignee);
        return issueRepository.save(issue);
    }

    @Override
    public Issue addTimeSpent(Long issueId, Integer minutes, User loggedBy) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));

        Integer currentTimeSpent = issue.getTimeSpent() != null ? issue.getTimeSpent() : 0;
        issue.setTimeSpent(currentTimeSpent + minutes);

        return issueRepository.save(issue);
    }

    @Override
    public List<Issue> getSubTasks(Long parentIssueId) {
        return issueRepository.findSubTasksByParentId(parentIssueId);
    }

    @Override
    public Issue createSubTask(Issue subTask, Long parentIssueId, User reporter) {
        Issue parentIssue = issueRepository.findById(parentIssueId)
                .orElseThrow(() -> new RuntimeException("Parent issue not found with id: " + parentIssueId));

        subTask.setParentIssue(parentIssue);
        subTask.setReporter(reporter);

        // Generate sub-task key
        String subTaskKey = issueKeyGenerator.generateIssueKey(subTask.getProject().getId());
        subTask.setKey(subTaskKey);

        return issueRepository.save(subTask);
    }
}