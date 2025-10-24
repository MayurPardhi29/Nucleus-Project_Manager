package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.Comment;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.User;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    List<Comment> getCommentsByIssue(Long issueId);
    Optional<Comment> getCommentById(Long id);
    Comment createComment(Comment comment, User author);
    Comment updateComment(Long id, Comment comment);
    void deleteComment(Long id);
    long countCommentsByIssue(Long issueId);
    List<Comment> getCommentsByIssueOrderByDate(Long issueId, boolean ascending);
}