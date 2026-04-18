package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.RestaurantEntity;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Long> {

    List<RestaurantEntity> findByProvinceId(Long provinceId);

    List<RestaurantEntity> findByStatus(String status);

    List<RestaurantEntity> findByProvinceIdAndStatus(Long provinceId, String status);

    @Query("SELECT r FROM RestaurantEntity r WHERE r.province.id = :provinceId AND r.category = :category")
    List<RestaurantEntity> findByProvinceAndCuisine(@Param("provinceId") Long provinceId, @Param("category") String category);

    @Query("SELECT r FROM RestaurantEntity r WHERE r.averagePrice BETWEEN :minPrice AND :maxPrice ORDER BY r.rating DESC")
    List<RestaurantEntity> findByPriceRange(@Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice);

    @Query("SELECT r FROM RestaurantEntity r WHERE r.rating >= :minRating ORDER BY r.rating DESC")
    List<RestaurantEntity> findByRatingGreaterThan(@Param("minRating") Double minRating);

    @Query("SELECT r FROM RestaurantEntity r WHERE r.province.id = :provinceId ORDER BY r.trendingScore DESC LIMIT :limit")
    List<RestaurantEntity> findTopTrendingByProvinceAndLimit(@Param("provinceId") Long provinceId, @Param("limit") Integer limit);

    @Query("SELECT r FROM RestaurantEntity r WHERE r.province.id = :provinceId AND r.averagePrice <= :maxPrice ORDER BY r.rating DESC LIMIT :limit")
    List<RestaurantEntity> findByProvinceAndMaxPrice(@Param("provinceId") Long provinceId, @Param("maxPrice") Long maxPrice, @Param("limit") Integer limit);

    // Search by name and location
    @Query("SELECT r FROM RestaurantEntity r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND r.status = 'OPENING' ORDER BY r.rating DESC")
    List<RestaurantEntity> findByNameContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT r FROM RestaurantEntity r WHERE LOWER(r.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND r.status = 'OPENING' ORDER BY r.rating DESC")
    List<RestaurantEntity> findByLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT r FROM RestaurantEntity r WHERE (LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND r.status = 'OPENING' ORDER BY r.rating DESC")
    List<RestaurantEntity> findByNameOrLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT r FROM RestaurantEntity r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND r.province.id = :provinceId AND r.status = 'OPENING' ORDER BY r.rating DESC")
    List<RestaurantEntity> findByNameContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);

    @Query("SELECT r FROM RestaurantEntity r WHERE LOWER(r.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND r.province.id = :provinceId AND r.status = 'OPENING' ORDER BY r.rating DESC")
    List<RestaurantEntity> findByLocationContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);
}