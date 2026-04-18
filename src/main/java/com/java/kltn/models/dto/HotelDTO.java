package com.java.kltn.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelDTO {

    private Long id;

    private String name;

    private String description;

    private String location;

    private Double rating;

    private Integer reviewCount;

    private String imageUrl;

    private List<String> gallery; // Bắt buộc phải là List để ra JSON Array

    private String previewVideo;

    private String category;

    private String status;

    private Long averagePrice;

    private Integer estimatedDuration;

    private Long provinceId;      // Chỉ lấy ID, không lấy nguyên Object
}