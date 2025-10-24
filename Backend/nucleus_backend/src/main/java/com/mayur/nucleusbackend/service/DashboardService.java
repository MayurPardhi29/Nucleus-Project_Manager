package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getUserDashboard(Long userId);
    DashboardResponse getProjectDashboard(Long projectId);
    DashboardResponse getOrganizationDashboard(Long organizationId);

    // Statistics
    long getUserOpenIssueCount(Long userId);
    long getUserProjectCount(Long userId);
    long getProjectIssueCountByStatus(Long projectId, String status);
    long getOrganizationProjectCount(Long organizationId);
    long getOrganizationMemberCount(Long organizationId);
}