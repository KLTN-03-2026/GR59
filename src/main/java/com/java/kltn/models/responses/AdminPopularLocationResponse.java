package com.java.kltn.models.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPopularLocationResponse {
    private String id;
    private String name;
    private String value;
    private Integer pct;
    private String color;
}
