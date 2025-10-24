package com.mayur.nucleusbackend.dto.request;

import com.mayur.nucleusbackend.enums.ProjectRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMemberRequest {
    private Long userId;
    private ProjectRole role;
}
