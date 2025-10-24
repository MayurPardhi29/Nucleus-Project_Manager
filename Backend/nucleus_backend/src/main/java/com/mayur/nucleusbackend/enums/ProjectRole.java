package com.mayur.nucleusbackend.enums;

public enum ProjectRole {
    ADMIN,   // Full project control - manage members, settings
    MEMBER,  // Create/edit issues, comment, assign
    VIEWER   // Read-only access - view only
}