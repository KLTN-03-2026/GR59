package com.java.kltn.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nearby_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class NearbyServiceEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attraction_id")
    private AttractionEntity attraction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private HotelEntity hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    private RestaurantEntity restaurant;

    @Column(nullable = false)
    private String serviceType; // e.g., "RESTAURANT", "HOTEL", "GAS_STATION", "HOSPITAL", "PHARMACY"

    @Column(nullable = false)
    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price_level")
    private String priceLevel; // e.g., "CHEAP", "MODERATE", "EXPENSIVE"

    @Column(nullable = false)
    private String status = "ACTIVE";
}
