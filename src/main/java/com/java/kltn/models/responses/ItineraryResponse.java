package com.java.kltn.models.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Complete itinerary information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryResponse {
    private String id;
    private String trip_name;
    private String duration;
    private Long price;
    private Double rating;
    private String img;
    private String location;
    private String category;
    private Integer maxPeople;
    private List<DayItineraryResponse> itinerary;
}
