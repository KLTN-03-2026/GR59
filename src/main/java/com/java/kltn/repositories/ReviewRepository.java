package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.ReviewEntity;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    Page<ReviewEntity> findByHotelId(Long hotelId, Pageable pageable);
    Page<ReviewEntity> findByRestaurantId(Long restaurantId, Pageable pageable);
    Page<ReviewEntity> findByAttractionId(Long attractionId, Pageable pageable);
    Page<ReviewEntity> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT r FROM ReviewEntity r WHERE r.user.id = :userId AND r.rating >= :minRating")
    List<ReviewEntity> findUserHighRatings(@Param("userId") Long userId, @Param("minRating") Integer minRating);

    @Query("SELECT r.user.id FROM ReviewEntity r WHERE r.attraction.id = :attractionId AND r.rating >= :minRating GROUP BY r.user.id")
    List<Long> findUserIdsByAttractionRating(@Param("attractionId") Long attractionId, @Param("minRating") Integer minRating);
}
