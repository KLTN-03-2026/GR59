package com.java.kltn.models.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Daily itinerary details
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayItineraryResponse {
    private Integer day;
    private String date;
    private String theme;
    private List<ActivityResponse> activities;
}
