package com.java.kltn.models.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneratedItineraryDTO {
    private String id;

    @JsonProperty("trip_name")
    private String tripName;

    private String duration;
    private Long price;
    private Double rating;
    private String img;
    private String location;
    private String category;

    @JsonProperty("maxPeople")
    private Integer maxPeople;

    private List<ItineraryDayDTO> itinerary;
}
