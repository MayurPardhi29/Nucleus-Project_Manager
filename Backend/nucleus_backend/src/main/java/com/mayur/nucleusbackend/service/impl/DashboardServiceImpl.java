package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.dto.response.DashboardResponse;
import com.mayur.nucleusbackend.enums.IssueStatus;
import com.mayur.nucleusbackend.repository.*;
import com.mayur.nucleusbackend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Override
    public DashboardResponse getUserDashboard(Long userId) {
        DashboardResponse response = new DashboardResponse();

        response.setOpenIssuesCount(getUserOpenIssueCount(userId));
        response.setProjectsCount(getUserProjectCount(userId));

        // Add recent activity, assigned issues, etc.
        Map<String, Object> stats = new HashMap<>();
        stats.put("assignedIssues", issueRepository.findActiveAssignedToUser(userId).size());
        stats.put("reportedIssues", issueRepository.findActiveReportedByUser(userId).size());

        response.setStats(stats);
        return response;
    }

    @Override
    public DashboardResponse getProjectDashboard(Long projectId) {
        DashboardResponse response = new DashboardResponse();

        Map<String, Long> statusCounts = new HashMap<>();
        for (IssueStatus status : IssueStatus.values()) {
            statusCounts.put(status.name(), getProjectIssueCountByStatus(projectId, status.name()));
        }

        response.setOpenIssuesCount(getProjectIssueCountByStatus(projectId, "OPEN"));
        response.setStats(Map.of("statusCounts", statusCounts));
        response.setMembersCount(projectMemberRepository.countByProjectId(projectId));

        return response;
    }

    @Override
    public DashboardResponse getOrganizationDashboard(Long organizationId) {
        DashboardResponse response = new DashboardResponse();

        response.setProjectsCount(getOrganizationProjectCount(organizationId));
        response.setMembersCount(getOrganizationMemberCount(organizationId));

        // Add organization-specific stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeProjects", projectRepository.findActiveByOrganizationId(organizationId).size());

        response.setStats(stats);
        return response;
    }

    @Override
    public long getUserOpenIssueCount(Long userId) {
        return issueRepository.findActiveAssignedToUser(userId).stream()
                .filter(issue -> issue.getStatus() == IssueStatus.OPEN ||
                        issue.getStatus() == IssueStatus.IN_PROGRESS)
                .count();
    }

    @Override
    public long getUserProjectCount(Long userId) {
        return projectRepository.findProjectsByUserId(userId).size();
    }

    @Override
    public long getProjectIssueCountByStatus(Long projectId, String status) {
        try {
            IssueStatus issueStatus = IssueStatus.valueOf(status);
            return issueRepository.countByProjectIdAndStatus(projectId, issueStatus);
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    @Override
    public long getOrganizationProjectCount(Long organizationId) {
        return projectRepository.findByOrganizationId(organizationId).size();
    }

    @Override
    public long getOrganizationMemberCount(Long organizationId) {
        // This would need a more complex query to count unique users across all projects in the organization
        return 0; // Placeholder
    }
}