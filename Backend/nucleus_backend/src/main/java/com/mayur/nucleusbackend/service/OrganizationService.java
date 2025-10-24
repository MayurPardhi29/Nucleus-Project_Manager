package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.Organization;
import com.mayur.nucleusbackend.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrganizationService {

    List<Organization> getAllOrganizations();
    Optional<Organization> getOrganizationById(Long id);
    Optional<Organization> getOrganizationBySlug(String slug);
    Organization createOrganization(Organization organization, User createdBy);
    Organization updateOrganization(Long id, Organization organization);
    void deleteOrganization(Long id);
    void softDeleteOrganization(Long id);
    List<Organization> getOrganizationsByUser(Long userId);
    List<Organization> getActiveOrganizations();
    boolean existsBySlug(String slug);
    long countActiveOrganizations();
}