package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.AuditLog;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.repository.AuditLogRepository;
import com.mayur.nucleusbackend.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void logAction(String action, String details, User user) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLog.setUser(user);
        auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> getLogsByUser(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    @Override
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }

    @Override
    public List<AuditLog> getLogsByDateRange(Instant startDate, Instant endDate) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate);
    }

    @Override
    public List<AuditLog> getUserLogsByDateRange(Long userId, Instant startDate, Instant endDate) {
        return auditLogRepository.findByUserAndTimestampBetween(userId, startDate, endDate);
    }

    @Override
    public List<AuditLog> getRecentLogs(int limit) {
        return auditLogRepository.findRecentLogs(limit);
    }

    @Override
    public long getUserActionCount(Long userId) {
        return auditLogRepository.countByUserId(userId);
    }

    @Override
    public void cleanupOldLogs(Instant cutoffDate) {
        auditLogRepository.deleteOldLogs(cutoffDate);
    }
}