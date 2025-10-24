package com.mayur.nucleusbackend.service.impl;

import com.mayur.nucleusbackend.entity.Attachment;
import com.mayur.nucleusbackend.entity.Issue;
import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.repository.AttachmentRepository;
import com.mayur.nucleusbackend.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.max-file-size:10485760}") // 10MB default
    private long maxFileSize;

    @Override
    public Attachment uploadAttachment(MultipartFile file, Issue issue, User uploadedBy) {
        // Validate file
        if (!isValidFileType(file.getOriginalFilename())) {
            throw new RuntimeException("Invalid file type");
        }

        if (!isFileSizeWithinLimit(file.getSize())) {
            throw new RuntimeException("File size exceeds limit");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Create attachment record
            Attachment attachment = new Attachment();
            attachment.setFileName(originalFilename);
            attachment.setFileUrl(filePath.toString());
            attachment.setFileSize(file.getSize());
            attachment.setIssue(issue);
            // Note: We don't have uploadedBy field in Attachment entity, you might want to add it

            return attachmentRepository.save(attachment);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Attachment> getAttachmentById(Long id) {
        return attachmentRepository.findById(id);
    }

    @Override
    public List<Attachment> getAttachmentsByIssue(Long issueId) {
        return attachmentRepository.findByIssueIdOrderByUploadedAtDesc(issueId);
    }

    @Override
    public void deleteAttachment(Long id) {
        Optional<Attachment> attachment = attachmentRepository.findById(id);
        if (attachment.isPresent()) {
            // Delete physical file
            try {
                Files.deleteIfExists(Paths.get(attachment.get().getFileUrl()));
            } catch (IOException e) {
                // Log error but continue with DB deletion
                System.err.println("Failed to delete physical file: " + e.getMessage());
            }
            // Delete database record
            attachmentRepository.deleteById(id);
        }
    }

    @Override
    public void deleteAttachmentsByIssue(Long issueId) {
        List<Attachment> attachments = attachmentRepository.findByIssueId(issueId);
        for (Attachment attachment : attachments) {
            deleteAttachment(attachment.getId());
        }
    }

    @Override
    public long getAttachmentCountByIssue(Long issueId) {
        return attachmentRepository.countByIssueId(issueId);
    }

    @Override
    public Long getTotalSizeByIssue(Long issueId) {
        return attachmentRepository.getTotalSizeByIssueId(issueId);
    }

    @Override
    public List<Attachment> searchAttachmentsByName(String fileName) {
        return attachmentRepository.findByFileNameContainingIgnoreCase(fileName);
    }

    @Override
    public boolean isValidFileType(String fileName) {
        if (fileName == null) return false;

        String extension = getFileExtension(fileName).toLowerCase();
        // Allowed file types
        return extension.equals(".pdf") || extension.equals(".doc") || extension.equals(".docx") ||
                extension.equals(".jpg") || extension.equals(".jpeg") || extension.equals(".png") ||
                extension.equals(".txt") || extension.equals(".zip");
    }

    @Override
    public boolean isFileSizeWithinLimit(long fileSize) {
        return fileSize <= maxFileSize;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}