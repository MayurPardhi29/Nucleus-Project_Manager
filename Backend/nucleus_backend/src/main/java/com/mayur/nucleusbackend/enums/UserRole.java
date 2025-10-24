package com.mayur.nucleusbackend.enums;

public enum UserRole {
    SUPER_ADMIN,    // System-wide admin - can manage everything
    ORG_ADMIN,      // Organization admin - can manage org projects
    PROJECT_ADMIN,  // Project admin - full project control
    DEVELOPER,      // Regular team member - create/edit issues
    VIEWER          // Read-only access
}