package com.java.kltn.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@MappedSuperclass
@Data
@EqualsAndHashCode(callSuper = true)
public abstract class BaseServiceEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id", nullable = false)
    private ProvinceEntity province;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "preview_video")
    private String previewVideo;

    @Column(name = "status", length = 50)
    private String status = "ACTIVE";

    private Double rating = 0.0;

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "average_price")
    private Long averagePrice;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "address_detailed", columnDefinition = "TEXT")
    private String addressDetailed;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "bookmark_count")
    private Integer bookmarkCount = 0;

    @Column(name = "booking_count")
    private Integer bookingCount = 0;

    @Column(name = "trending_score")
    private Double trendingScore = 0.0;

    @Column(name = "opening_hours")
    private String openingHours;

    @Column(name = "best_time_to_visit")
    private String bestTimeToVisit;
}