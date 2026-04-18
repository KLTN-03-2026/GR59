package com.java.kltn.models.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateItineraryRequest {
    private String destination;
    private String duration;  // e.g., "5 ngày 4 đêm"
    private Integer members;
    private Long budget;
    private List<String> preferences;  // e.g., ["văn hóa", "ẩm thực"]
    private Integer numberOfItineraries;  // default 3, max 5
}
