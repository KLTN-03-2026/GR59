package com.java.kltn.models.responses;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String role;
    private Boolean isActive;
    private String address;
    private LocalDateTime createdAt;
    private String phone;
    private String googleId;
    private String facebookId;
    private Boolean isGoogleLinked;
    private Boolean isFacebookLinked;
    private Boolean isEmailVerified;
}


