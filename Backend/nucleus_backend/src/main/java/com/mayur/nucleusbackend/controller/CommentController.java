package com.mayur.nucleusbackend.controller;

import com.mayur.nucleusbackend.dto.request.CommentRequest;
import com.mayur.nucleusbackend.dto.response.ApiResponse;
import com.mayur.nucleusbackend.dto.response.CommentResponse;
import com.mayur.nucleusbackend.dto.response.UserResponse;
import com.mayur.nucleusbackend.entity.Comment;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.service.CommentService;
import com.mayur.nucleusbackend.service.IssueService;
import com.mayur.nucleusbackend.service.PermissionService;
import com.mayur.nucleusbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @Autowired
    private PermissionService permissionService;

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getCommentsByIssue(
            @PathVariable Long issueId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can view comments for this issue
            if (!permissionService.canViewComments(currentUser.getId(), issueId)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to view comments for this issue"));
            }

            List<Comment> comments = commentService.getCommentsByIssue(issueId);
            List<CommentResponse> responses = comments.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Comments fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch comments: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> getCommentById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Comment comment = commentService.getCommentById(id)
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

            // Check if user can view comments for this issue
            if (!permissionService.canViewComments(currentUser.getId(), comment.getIssue().getId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to view this comment"));
            }

            return ResponseEntity.ok(ApiResponse.success("Comment fetched successfully", convertToResponse(comment)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @RequestBody CommentRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can create comments for this issue
            if (!permissionService.canCreateComment(currentUser.getId(), request.getIssueId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to comment on this issue"));
            }

            Issue issue = issueService.getIssueById(request.getIssueId())
                    .orElseThrow(() -> new RuntimeException("Issue not found with id: " + request.getIssueId()));

            Comment comment = new Comment();
            comment.setContent(request.getContent());
            comment.setIssue(issue);

            Comment savedComment = commentService.createComment(comment, currentUser);

            return ResponseEntity.ok(ApiResponse.success("Comment created successfully", convertToResponse(savedComment)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create comment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long id,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can edit this comment
            if (!permissionService.canEditComment(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to edit this comment"));
            }

            Comment commentUpdate = new Comment();
            commentUpdate.setContent(request.getContent());

            Comment updatedComment = commentService.updateComment(id, commentUpdate);

            return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", convertToResponse(updatedComment)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update comment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user can delete this comment
            if (!permissionService.canDeleteComment(currentUser.getId(), id)) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("Access denied to delete this comment"));
            }

            commentService.deleteComment(id);
            return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete comment: " + e.getMessage()));
        }
    }

    // Helper method to convert Comment entity to CommentResponse DTO
    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(convertUserToResponse(comment.getAuthor())) // ✅ Fixed: Add author
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    // ADD: Helper method to convert User to UserResponse
    private UserResponse convertUserToResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole()) // Assuming role is an Enum
//                .isActive(user.isActive())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}