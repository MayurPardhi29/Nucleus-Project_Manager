package com.mayur.nucleusbackend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationCreateRequest {
    private String name;
    private String slug;
    private String description;
}
