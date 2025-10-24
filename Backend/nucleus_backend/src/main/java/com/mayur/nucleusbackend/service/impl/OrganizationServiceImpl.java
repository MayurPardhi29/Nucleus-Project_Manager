package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Organization;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.repository.OrganizationRepository;
import com.mayur.nucleusbackend.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    @Override
    public Optional<Organization> getOrganizationById(Long id) {
        return organizationRepository.findById(id);
    }

    @Override
    public Optional<Organization> getOrganizationBySlug(String slug) {
        return organizationRepository.findBySlug(slug);
    }

    @Override
    public Organization createOrganization(Organization organization, User createdBy) {
        organization.setCreatedBy(createdBy);
        return organizationRepository.save(organization);
    }

    @Override
    public Organization updateOrganization(Long id, Organization organization) {
        Organization existingOrg = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));

        existingOrg.setName(organization.getName());
        existingOrg.setSlug(organization.getSlug());
        existingOrg.setDescription(organization.getDescription());

        return organizationRepository.save(existingOrg);
    }

    @Override
    public void deleteOrganization(Long id) {
        organizationRepository.deleteById(id);
    }

    @Override
    public void softDeleteOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        organization.setDeletedAt(Instant.now());
        organizationRepository.save(organization);
    }

    @Override
    public List<Organization> getOrganizationsByUser(Long userId) {
        return organizationRepository.findByCreatedById(userId);
    }

    @Override
    public List<Organization> getActiveOrganizations() {
        return organizationRepository.findAllActive();
    }

    @Override
    public boolean existsBySlug(String slug) {
        return organizationRepository.existsBySlug(slug);
    }

    @Override
    public long countActiveOrganizations() {
        return organizationRepository.countActiveOrganizations();
    }
}