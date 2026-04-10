package com.java.kltn.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.PlaceEntity;
import com.java.kltn.entities.ProvinceEntity;

@Repository
public interface PlaceRepository extends JpaRepository<PlaceEntity, Long> {

    @EntityGraph(attributePaths = {"province"})
    List<PlaceEntity> findAll();

    List<PlaceEntity> findByProvince(ProvinceEntity province);
    
    List<PlaceEntity> findByCategory(String category);
    
    Optional<PlaceEntity> findByName(String name);
    
    List<PlaceEntity> findByStatus(String status);
    
    List<PlaceEntity> findByType(String type);
    
    // Search places by name
    @Query("SELECT p FROM PlaceEntity p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<PlaceEntity> searchPlaces(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find places by category with pagination
    Page<PlaceEntity> findByCategory(String category, Pageable pageable);
    
    // Find places with rating >= specified value
    List<PlaceEntity> findByRatingGreaterThanEqual(Double rating);
    
    // Find all places sorted by rating
    List<PlaceEntity> findAllByOrderByRatingDesc();
    
    // Find hotels (category = HOTEL)
    @Query("SELECT p FROM PlaceEntity p WHERE p.category = 'HOTEL'")
    List<PlaceEntity> findAllHotels();
    
    @Query("SELECT p FROM PlaceEntity p WHERE p.category = 'HOTEL'")
    Page<PlaceEntity> findAllHotels(Pageable pageable);
    
    // Find restaurants (category = RESTAURANT)
    @Query("SELECT p FROM PlaceEntity p WHERE p.category = 'RESTAURANT'")
    List<PlaceEntity> findAllRestaurants();
    
    @Query("SELECT p FROM PlaceEntity p WHERE p.category = 'RESTAURANT'")
    Page<PlaceEntity> findAllRestaurants(Pageable pageable);
    
    // Find attractions (category = ATTRACTION)
    @Query("SELECT p FROM PlaceEntity p WHERE p.category = 'ATTRACTION'")
    List<PlaceEntity> findAllAttractions();
}
