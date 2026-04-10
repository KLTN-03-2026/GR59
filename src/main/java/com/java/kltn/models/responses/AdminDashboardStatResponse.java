package com.java.kltn.models.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatResponse {
    private String id;
    private String label;
    private String value;
    private String trend;
    private Boolean trendUp;
    private String icon;
    private String colorClass;
    private String footerText;
}
