package com.java.kltn.models.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteLocationDTO implements Serializable {

    private Long id;

    private Long userId;

    private Long locationId;

    private String locationType; // ATTRACTION, HOTEL, RESTAURANT

    private String locationName;

    private String imageUrl;

    private Double rating;

    private String address;

    private LocalDateTime createdAt;
}
