package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.AuditLog;
import com.mayur.nucleusbackend.entity.User;

import java.time.Instant;
import java.util.List;

public interface AuditLogService {

	void logAction(String action, String details, User user);
	List<AuditLog> getLogsByUser(Long userId);
	List<AuditLog> getLogsByAction(String action);
	List<AuditLog> getLogsByDateRange(Instant startDate, Instant endDate);
	List<AuditLog> getUserLogsByDateRange(Long userId, Instant startDate, Instant endDate);
	List<AuditLog> getRecentLogs(int limit);
	long getUserActionCount(Long userId);
	void cleanupOldLogs(Instant cutoffDate);
}