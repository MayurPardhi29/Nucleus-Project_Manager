package com.mayur.nucleusbackend.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private UserResponse author;
    private Instant createdAt;
    private Instant updatedAt;
}
