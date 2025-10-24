package com.mayur.nucleusbackend.dto.request;

import com.mayur.nucleusbackend.enums.UserRole;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private UserRole role;

}
