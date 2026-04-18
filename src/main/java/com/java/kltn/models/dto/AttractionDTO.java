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
public class AttractionDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Tên điểm du lịch không được để trống")
    private String name;

    private String description;

    private String location;

    @Min(value = 0, message = "Rating không được nhỏ hơn 0")
    @Max(value = 5, message = "Rating không được lớn hơn 5")
    private Double rating;

    private Integer reviewCount;

    @NotBlank(message = "Loại ẩm thực không được để trống")
    private String category;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    private Long averagePrice;

    private List<String> gallery;

    private Integer estimatedDuration;

    private String imageUrl;

    private String previewVideo;

    @NotNull(message = "Tỉnh không được để trống")
    private Long provinceId;
}
