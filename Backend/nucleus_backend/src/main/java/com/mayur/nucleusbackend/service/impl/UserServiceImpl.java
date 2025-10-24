package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.dto.request.UserCreateRequest;
import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.UserRole;
import com.mayur.nucleusbackend.repository.UserRepository;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ADD THIS MISSING METHOD
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        // Check if user already exists
        if (userRepository.existsByUsername(userCreateRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(userCreateRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user entity
        User user = new User();
        user.setUsername(userCreateRequest.getUsername());
        user.setEmail(userCreateRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setDisplayName(userCreateRequest.getDisplayName());
        user.setRole(userCreateRequest.getRole() != null ? userCreateRequest.getRole() : UserRole.DEVELOPER);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Convert to UserResponse
        return convertToUserResponse(savedUser);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setDisplayName(user.getDisplayName());
        existingUser.setRole(user.getRole());
        existingUser.setIsActive(user.getIsActive());

        return userRepository.save(existingUser);
    }

    @Override
    public User partialUpdateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
        if (user.getDisplayName() != null) existingUser.setDisplayName(user.getDisplayName());
        if (user.getRole() != null) existingUser.setRole(user.getRole());
        if (user.getIsActive() != null) existingUser.setIsActive(user.getIsActive());
        if (user.getLastLoginAt() != null) existingUser.setLastLoginAt(user.getLastLoginAt());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setDeletedAt(Instant.now());
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public long countActiveUsers() {
        return userRepository.countActiveUsers();
    }

    @Override
    public void updatePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Helper method to convert User entity to UserResponse DTO
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getIsActive(),
                user.getLastLoginAt(),
                user.getCreatedAt()
        );
    }
}