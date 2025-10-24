package com.mayur.nucleusbackend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 100)
	private String action;

	@Column(columnDefinition = "TEXT")
	private String details;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@CreationTimestamp
	@Column(name = "timestamp", updatable = false)
	private Instant timestamp;

	// Constructors
	public AuditLog() {}

	public AuditLog(String action, String details, User user) {
		this.action = action;
		this.details = details;
		this.user = user;
	}

	// Getters and Setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getAction() { return action; }
	public void setAction(String action) { this.action = action; }

	public String getDetails() { return details; }
	public void setDetails(String details) { this.details = details; }

	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }

	public Instant getTimestamp() { return timestamp; }
	public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}