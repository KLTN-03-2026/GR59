package com.java.kltn.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.FavoriteLocationEntity;

@Repository
public interface FavoriteLocationRepository extends JpaRepository<FavoriteLocationEntity, Long> {

    // Lấy tất cả địa điểm yêu thích của một user
    Page<FavoriteLocationEntity> findByUserId(Long userId, Pageable pageable);

    List<FavoriteLocationEntity> findByUserId(Long userId);

    // ===== ATTRACTION =====
    Optional<FavoriteLocationEntity> findByUserIdAndAttractionIdAndLocationType(
            Long userId, Long attractionId, String locationType);

    void deleteByUserIdAndAttractionIdAndLocationType(
            Long userId, Long attractionId, String locationType);

    Long countByAttractionIdAndLocationType(Long attractionId, String locationType);

    boolean existsByUserIdAndAttractionIdAndLocationType(
            Long userId, Long attractionId, String locationType);

    List<FavoriteLocationEntity> findByAttractionIdAndLocationType(Long attractionId, String locationType);

    // ===== HOTEL =====
    Optional<FavoriteLocationEntity> findByUserIdAndHotelIdAndLocationType(
            Long userId, Long hotelId, String locationType);

    void deleteByUserIdAndHotelIdAndLocationType(
            Long userId, Long hotelId, String locationType);

    Long countByHotelIdAndLocationType(Long hotelId, String locationType);

    boolean existsByUserIdAndHotelIdAndLocationType(
            Long userId, Long hotelId, String locationType);

    List<FavoriteLocationEntity> findByHotelIdAndLocationType(Long hotelId, String locationType);

    // ===== RESTAURANT =====
    Optional<FavoriteLocationEntity> findByUserIdAndRestaurantIdAndLocationType(
            Long userId, Long restaurantId, String locationType);

    void deleteByUserIdAndRestaurantIdAndLocationType(
            Long userId, Long restaurantId, String locationType);

    Long countByRestaurantIdAndLocationType(Long restaurantId, String locationType);

    boolean existsByUserIdAndRestaurantIdAndLocationType(
            Long userId, Long restaurantId, String locationType);

    List<FavoriteLocationEntity> findByRestaurantIdAndLocationType(Long restaurantId, String locationType);
}
