package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.AttractionEntity;

@Repository
public interface AttractionRepository extends JpaRepository<AttractionEntity, Long> {

    List<AttractionEntity> findByProvinceId(Long provinceId);

    List<AttractionEntity> findByStatus(String status);

    List<AttractionEntity> findByProvinceIdAndStatus(Long provinceId, String status);

    @Query("SELECT a FROM AttractionEntity a WHERE a.province.id = :provinceId AND a.category = :category")
    List<AttractionEntity> findByProvinceAndCategory(@Param("provinceId") Long provinceId, @Param("category") String category);

    @Query("SELECT a FROM AttractionEntity a WHERE a.averagePrice BETWEEN :minPrice AND :maxPrice ORDER BY a.rating DESC")
    List<AttractionEntity> findByPriceRange(@Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice);

    @Query("SELECT a FROM AttractionEntity a WHERE a.rating >= :minRating ORDER BY a.rating DESC")
    List<AttractionEntity> findByRatingGreaterThan(@Param("minRating") Double minRating);

    @Query("SELECT a FROM AttractionEntity a ORDER BY a.trendingScore DESC LIMIT :limit")
    List<AttractionEntity> findTopTrendingByLimit(@Param("limit") Integer limit);

    @Query("SELECT a FROM AttractionEntity a WHERE a.province.id = :provinceId ORDER BY a.viewCount DESC LIMIT :limit")
    List<AttractionEntity> findTopByProvinceOrderByViewCount(@Param("provinceId") Long provinceId, @Param("limit") Integer limit);

    // Search by name and location
    @Query("SELECT a FROM AttractionEntity a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND a.status = 'ACTIVE' ORDER BY a.rating DESC")
    List<AttractionEntity> findByNameContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT a FROM AttractionEntity a WHERE LOWER(a.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND a.status = 'ACTIVE' ORDER BY a.rating DESC")
    List<AttractionEntity> findByLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT a FROM AttractionEntity a WHERE (LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND a.status = 'ACTIVE' ORDER BY a.rating DESC")
    List<AttractionEntity> findByNameOrLocationContainingAndActive(@Param("keyword") String keyword);

    @Query("SELECT a FROM AttractionEntity a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND a.province.id = :provinceId AND a.status = 'ACTIVE' ORDER BY a.rating DESC")
    List<AttractionEntity> findByNameContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);

    @Query("SELECT a FROM AttractionEntity a WHERE LOWER(a.location) LIKE LOWER(CONCAT('%', :keyword, '%')) AND a.province.id = :provinceId AND a.status = 'ACTIVE' ORDER BY a.rating DESC")
    List<AttractionEntity> findByLocationContainingAndProvinceIdAndActive(@Param("keyword") String keyword, @Param("provinceId") Long provinceId);
}