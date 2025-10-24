package com.mayur.nucleusbackend.util;

import com.mayur.nucleusbackend.entity.Project;
import com.mayur.nucleusbackend.repository.ProjectRepository;
import com.mayur.nucleusbackend.repository.ProjectSequencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class IssueKeyGenerator {

    @Autowired
    private ProjectSequencesRepository projectSequencesRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Transactional
    public String generateIssueKey(Long projectId) {
        // Get project key
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        // Initialize sequence if it doesn't exist
        projectSequencesRepository.initializeSequence(projectId);

        // Get current number
        Integer nextNumber = projectSequencesRepository.findNextIssueNumberByProjectId(projectId);

        // Increment for next call
        projectSequencesRepository.incrementNextIssueNumber(projectId);

        return project.getKey() + "-" + nextNumber;
    }
}