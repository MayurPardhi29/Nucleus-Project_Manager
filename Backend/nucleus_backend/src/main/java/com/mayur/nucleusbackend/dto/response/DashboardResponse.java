package com.mayur.nucleusbackend.dto.response;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Long openIssuesCount;
    private Long projectsCount;
    private Long membersCount;
    private Map<String, Object> stats;
}
