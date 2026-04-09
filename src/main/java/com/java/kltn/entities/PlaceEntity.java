package com.java.kltn.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "places")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceEntity extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private ProvinceEntity province;

    @Column(nullable = false)
    private String name;

    // Category: HOTEL, RESTAURANT, ATTRACTION, CAFE, etc.
    @Column(nullable = false)
    private String category;

    // Additional type info (for hotels: RESORT, LUXURY, etc. / for restaurants: cuisine type)
    private String type;

    private Double rating = 0.0; // Điểm trung bình

    private Integer reviewCount = 0; // Tổng số lượt đánh giá

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private String status = "HOẠT ĐỘNG"; // HOẠT ĐỘNG or ĐÓNG CỬA
    
    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "preview_video")
    private String previewVideo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
