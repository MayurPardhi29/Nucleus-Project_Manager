package com.mayur.nucleusbackend.dto.request;

import com.mayur.nucleusbackend.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserCreateRequest {
    @NotBlank @Size(min=3, max=50)
    private String username;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min=6, max=100)
    private String password;

    private String displayName;

    @NotNull
    private UserRole role;
}
