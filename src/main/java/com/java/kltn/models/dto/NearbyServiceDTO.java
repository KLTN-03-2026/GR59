package com.java.kltn.models.dto;

import java.io.Serializable;

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
public class NearbyServiceDTO implements Serializable {

    private Long id;

    private Long attractionId;  // ID của Attraction (nếu là dịch vụ gần Attraction)

    private Long hotelId;       // ID của Hotel (nếu là dịch vụ gần Hotel)

    private Long restaurantId;  // ID của Restaurant (nếu là dịch vụ gần Restaurant)

    @NotBlank(message = "Loại dịch vụ không được để trống")
    private String serviceType;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    private String description;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotNull(message = "Vĩ độ không được để trống")
    private Double latitude;

    @NotNull(message = "Kinh độ không được để trống")
    private Double longitude;

    private Double distanceKm;

    private String phoneNumber;

    private String openingHours;

    private Double rating;

    private Integer reviewCount;

    private String imageUrl;

    private String priceLevel;

    private String status;
}
