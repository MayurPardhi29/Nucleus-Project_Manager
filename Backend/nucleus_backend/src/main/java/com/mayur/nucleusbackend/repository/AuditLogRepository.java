package com.mayur.nucleusbackend.repository;

import com.mayur.nucleusbackend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByAction(String action);

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByTimestampBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

    @Query("SELECT a FROM AuditLog a WHERE a.user.id = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByUserAndTimestampBetween(@Param("userId") Long userId,
                                                 @Param("startDate") Instant startDate,
                                                 @Param("endDate") Instant endDate);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM AuditLog a ORDER BY a.timestamp DESC LIMIT :limit")
    List<AuditLog> findRecentLogs(@Param("limit") int limit);

    @Query("DELETE FROM AuditLog a WHERE a.timestamp < :cutoffDate")
    void deleteOldLogs(@Param("cutoffDate") Instant cutoffDate);
}