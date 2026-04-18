package com.java.kltn.models.dto;

import java.io.Serializable;
import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Tên không được để trống")
    private String name;

    private String description;

    private String location;

    @Min(value = 0, message = "Rating không được nhỏ hơn 0")
    @Max(value = 5, message = "Rating không được lớn hơn 5")
    private Double rating;

    private Integer reviewCount;

    private String imageUrl;

    private List<String> gallery;

    private String previewVideo;

    // Category: HOTEL/RESORT/CLASSIC (type), MON_VIET/HAI_SAN (cuisine), VAN_HOA/THIEN_NHIEN (category)
    private String category;

    private String status;

    private Long averagePrice;

    private Integer estimatedDuration;

    @NotNull(message = "Tỉnh không được để trống")
    private Long provinceId;

    // Loại điểm đến: HOTEL, RESTAURANT, ATTRACTION
    private String destinationType;
}
