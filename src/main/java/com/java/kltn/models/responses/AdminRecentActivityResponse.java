package com.java.kltn.models.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRecentActivityResponse {
    private String id;
    private String time;
    private String date;
    private String user;
    private String email;
    private String action;
    private String status;
    private String color;
    private Integer avatarId;
}
