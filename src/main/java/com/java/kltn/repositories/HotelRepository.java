package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.HotelEntity;

@Repository
public interface HotelRepository extends JpaRepository<HotelEntity, Long> {

    List<HotelEntity> findByProvinceId(Long provinceId);

    List<HotelEntity> findByStatus(String status);

    List<HotelEntity> findByProvinceIdAndStatus(Long provinceId, String status);

    @Query("SELECT h FROM HotelEntity h WHERE h.averagePrice BETWEEN :minPrice AND :maxPrice ORDER BY h.rating DESC")
    List<HotelEntity> findByPriceRange(@Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice);

    @Query("SELECT h FROM HotelEntity h WHERE h.rating >= :minRating ORDER BY h.rating DESC")
    List<HotelEntity> findByRatingGreaterThan(@Param("minRating") Double minRating);

    @Query("SELECT h FROM HotelEntity h WHERE h.province.id = :provinceId ORDER BY h.trendingScore DESC LIMIT :limit")
    List<HotelEntity> findTopTrendingByProvinceAndLimit(@Param("provinceId") Long provinceId, @Param("limit") Integer limit);

    @Query("SELECT h FROM HotelEntity h WHERE h.province.id = :provinceId AND h.averagePrice <= :maxPrice ORDER BY h.rating DESC LIMIT :limit")
    List<HotelEntity> findByProvinceAndMaxPrice(@Param("provinceId") Long provinceId, @Param("maxPrice") Long maxPrice, @Param("limit") Integer limit);

    // Search by name and location
    @Query("SELECT h FROM HotelEntity h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND h.status = 'ACTIVE' ORDER BY h.rating DESC")
    List<HotelEntity> findByNameContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT h FROM HotelEntity h WHERE LOWER(h.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND h.status = 'ACTIVE' ORDER BY h.rating DESC")
    List<HotelEntity> findByLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT h FROM HotelEntity h WHERE (LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(h.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND h.status = 'ACTIVE' ORDER BY h.rating DESC")
    List<HotelEntity> findByNameOrLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT h FROM HotelEntity h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND h.province.id = :provinceId AND h.status = 'ACTIVE' ORDER BY h.rating DESC")
    List<HotelEntity> findByNameContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);

    @Query("SELECT h FROM HotelEntity h WHERE LOWER(h.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND h.province.id = :provinceId AND h.status = 'ACTIVE' ORDER BY h.rating DESC")
    List<HotelEntity> findByLocationContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);
}