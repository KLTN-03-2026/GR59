package com.java.kltn.models.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.java.kltn.enums.ReviewType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO implements Serializable {

    private Long id;

    @NotNull(message = "User không được để trống")
    private Long userId;

    private Long hotelId;

    private Long restaurantId;

    private Long attractionId;

    @NotNull(message = "Loại review không được để trống")
    private ReviewType type;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Rating phải từ 1 đến 5")
    private Integer rating;

    private String comment;

    @Builder.Default
    private Boolean isVerified = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String updatedBy;
}
