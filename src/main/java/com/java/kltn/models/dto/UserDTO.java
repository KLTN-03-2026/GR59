package com.java.kltn.models.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    private String email;

    private String fullName;

    private String address;

    private String phone;

    private String avatarUrl;

    private String bio;

    private Long roleId;

    private String roleName;

    private Boolean isActive;

    private Boolean isEmailVerified;

    private String googleId;

    private String facebookId;

    private Boolean isGoogleLinked;

    private Boolean isFacebookLinked;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
