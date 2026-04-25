package com.java.kltn.models.request;

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
public class AddFavoriteLocationRequest {

    @NotNull(message = "ID địa điểm không được để trống")
    private Long locationId;

    @NotBlank(message = "Loại địa điểm không được để trống")
    private String locationType; // ATTRACTION, HOTEL, RESTAURANT

    @NotBlank(message = "Tên địa điểm không được để trống")
    private String locationName;

    private String imageUrl;

    private Double rating;

    private String address;
}
