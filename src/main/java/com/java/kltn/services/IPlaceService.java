package com.java.kltn.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.java.kltn.entities.PlaceEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.models.request.PlaceSearchRequest;

public interface IPlaceService {
    // === PROVINCE ===
    List<ProvinceEntity> getAllProvinces();
    Optional<ProvinceEntity> getProvinceById(Long provinceId);
    List<PlaceEntity> getPlacesByProvince(Long provinceId);
    
    // === BASIC CRUD ===
    PlaceEntity createPlace(PlaceEntity place);
    Optional<PlaceEntity> getPlaceById(Long placeId);
    PlaceEntity updatePlace(Long placeId, PlaceEntity place);
    void deletePlace(Long placeId);
    
    // === QUERY ===
    List<PlaceEntity> getAllPlaces();
    Page<PlaceEntity> getAllPlaces(Pageable pageable);
    Page<PlaceEntity> searchPlaces(String searchTerm, Pageable pageable);
    List<PlaceEntity> getPlacesByCategory(String category);
    Page<PlaceEntity> getPlacesByCategory(String category, Pageable pageable);
    List<PlaceEntity> getPlacesByStatus(String status);
    List<PlaceEntity> getTopRatedPlaces();
    
    // === SPECIALIZED QUERIES ===
    List<PlaceEntity> getAllHotels();
    List<PlaceEntity> getAllRestaurants();
    List<PlaceEntity> getAllAttractions();
    
    // === FAVORITES ===
    Map<String, Object> addToFavorite(Long placeId);
    Map<String, Object> removeFromFavorite(Long placeId);
    List<PlaceEntity> getFavoritePlaces();
    
    // === SEARCH & FILTER ===
    List<PlaceEntity> searchPlaces(PlaceSearchRequest request);
    PlaceEntity getPlaceDetail(Long placeId);
}
