package com.mayur.nucleusbackend.service;

import com.mayur.nucleusbackend.entity.Attachment;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface AttachmentService {

    Attachment uploadAttachment(MultipartFile file, Issue issue, User uploadedBy);
    Optional<Attachment> getAttachmentById(Long id);
    List<Attachment> getAttachmentsByIssue(Long issueId);
    void deleteAttachment(Long id);
    void deleteAttachmentsByIssue(Long issueId);
    long getAttachmentCountByIssue(Long issueId);
    Long getTotalSizeByIssue(Long issueId);
    List<Attachment> searchAttachmentsByName(String fileName);

    // File validation
    boolean isValidFileType(String fileName);
    boolean isFileSizeWithinLimit(long fileSize);
}