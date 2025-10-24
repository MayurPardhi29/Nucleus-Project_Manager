package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Comment;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.repository.CommentRepository;
import com.mayur.nucleusbackend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<Comment> getCommentsByIssue(Long issueId) {
        return commentRepository.findByIssueIdOrderByCreatedAtDesc(issueId);
    }

    @Override
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Comment createComment(Comment comment, User author) {
        // ✅ Automatically set the logged-in user as author
        comment.setAuthor(author);
        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Long id, Comment commentUpdate) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(commentUpdate.getContent());
            return commentRepository.save(comment);
        }).orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public long countCommentsByIssue(Long issueId) {
        return commentRepository.countByIssueId(issueId);
    }

    @Override
    public List<Comment> getCommentsByIssueOrderByDate(Long issueId, boolean ascending) {
        if (ascending) {
            return commentRepository.findByIssueId(issueId); // Default is ascending by ID
        } else {
            return commentRepository.findByIssueIdOrderByCreatedAtDesc(issueId);
        }
    }
}