package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.UserRole;
import com.mayur.nucleusbackend.dto.request.CreateUserByAdminRequest;
import java.util.List;
import java.util.Optional;

public interface UserService {

    // Existing methods
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
//    UserResponse createUser(UserCreateRequest userCreateRequest);
    UserResponse createUserByAdmin(CreateUserByAdminRequest request);
    User updateUser(Long id, User user);
    User partialUpdateUser(Long id, User user);
    void deleteUser(Long id);
    void softDeleteUser(Long id);
    List<User> getUsersByRole(UserRole role);
    List<User> getActiveUsers();
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    long countActiveUsers();

    // Add these missing methods
    Optional<User> findByUsername(String username);
//    void updatePassword(String username, String newPassword);
//
//    UserResponse createUserByAdmin(
//            CreateUserByAdminRequest request
//    );
}