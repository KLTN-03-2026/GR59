package com.java.kltn.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDTO {
    private Long id;
    private String name;
    private String type;  // ATTRACTION, HOTEL, RESTAURANT
    private String category;
    private Double rating;
    private Integer reviewCount;
    private Long averagePrice;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Double distanceFromHotel;
    private Integer estimatedDuration;  // in minutes
    private String reason;  // Why recommended
    private Double confidenceScore;  // 0-1, how confident is this recommendation

    // Popularity metrics
    private Integer bookingCount;
    private Double trendingScore;
}
