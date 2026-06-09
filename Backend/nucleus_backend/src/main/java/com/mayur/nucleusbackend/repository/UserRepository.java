package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);
	Optional<User> findByEmail(String email);
	List<User> findByRole(UserRole role);
	List<User> findByIsActiveTrue();

	@Query("SELECT u FROM User u WHERE u.isActive = true AND u.deletedAt IS NULL")
	List<User> findAllActiveUsers();

	@Query("SELECT u FROM User u WHERE u.id IN (SELECT pm.user.id FROM ProjectMember pm WHERE pm.project.id = :projectId)")
	List<User> findUsersByProjectId(@Param("projectId") Long projectId);

	boolean existsByUsername(String username);
	boolean existsByEmail(String email);

	@Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.deletedAt IS NULL")
	long countActiveUsers();

	Optional<User> findByUsernameAndDeletedAtIsNull(String username);
}