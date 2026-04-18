package com.java.kltn.models.request;


import com.java.kltn.enums.HotelStatus;
import com.java.kltn.enums.HotelType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelRequest {

    @NotBlank(message = "Tên không được để trống")
    private String name;

    private String description;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;

    @Min(0) @Max(5)
    private Double rating;

    private Integer reviewCount;

    private String imageUrl;

    private List<String> gallery;

    private String previewVideo;

    private String category;

    private String status;

    private Long averagePrice;

    private Integer estimatedDuration;

    @NotNull(message = "Province ID bắt buộc")
    private Long provinceId;
}