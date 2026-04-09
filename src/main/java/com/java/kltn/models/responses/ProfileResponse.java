package com.java.kltn.models.responses;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String address;
    private String phone;
    private String bio;
}

