package com.java.kltn.models.request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationRequest {
    private String destination;
    private LocalDate date;
    private Double budgetLeft;
    private String travelStyle;  // e.g., ADVENTURE, RELAX, CULTURAL
    private Integer limit;  // default 10
}
