package com.mayur.nucleusbackend.dto.request;

import com.mayur.nucleusbackend.enums.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    private String username;
    private String email;
    private String displayName;
    private UserRole role;
    private Boolean isActive;

}