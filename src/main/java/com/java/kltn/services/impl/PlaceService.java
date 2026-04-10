package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.java.kltn.entities.PlaceEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.models.request.PlaceSearchRequest;
import com.java.kltn.repositories.PlaceRepository;
import com.java.kltn.repositories.ProvinceRepository;
import com.java.kltn.services.IPlaceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlaceService implements IPlaceService {

    private final PlaceRepository placeRepository;
    private final ProvinceRepository provinceRepository;
    
    // In-memory favorite storage
    private final Set<Long> favorites = Collections.synchronizedSet(new HashSet<>());

    @Override
    public List<ProvinceEntity> getAllProvinces() {
        return provinceRepository.findAll();
    }

    @Override
    public Optional<ProvinceEntity> getProvinceById(Long provinceId) {
        return provinceRepository.findById(provinceId);
    }

    @Override
    public List<PlaceEntity> getPlacesByProvince(Long provinceId) {
        ProvinceEntity province = provinceRepository.findById(provinceId)
                .orElseThrow(() -> new RuntimeException("Province not found"));
        return placeRepository.findByProvince(province);
    }

    @Override
    public PlaceEntity createPlace(PlaceEntity place) {
        if (place.getCreatedAt() == null) {
            place.setCreatedAt(LocalDateTime.now());
        }
        if (place.getUpdatedAt() == null) {
            place.setUpdatedAt(LocalDateTime.now());
        }
        if (place.getStatus() == null) {
            place.setStatus("HOẠT ĐỘNG");
        }
        return placeRepository.save(place);
    }

    @Override
    public Optional<PlaceEntity> getPlaceById(Long placeId) {
        return placeRepository.findById(placeId);
    }

    @Override
    public PlaceEntity updatePlace(Long placeId, PlaceEntity placeUpdate) {
        PlaceEntity place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found with id: " + placeId));
        
        if (placeUpdate.getName() != null) place.setName(placeUpdate.getName());
//        if (placeUpdate.getLocation() != null) place.setLocation(placeUpdate.getLocation());
        if (placeUpdate.getCategory() != null) place.setCategory(placeUpdate.getCategory());
        if (placeUpdate.getType() != null) place.setType(placeUpdate.getType());
        if (placeUpdate.getRating() != null) place.setRating(placeUpdate.getRating());
//        if (placeUpdate.getReviews() != null) place.setReviews(placeUpdate.getReviews());
        if (placeUpdate.getDescription() != null) place.setDescription(placeUpdate.getDescription());
        if (placeUpdate.getStatus() != null) place.setStatus(placeUpdate.getStatus());
        if (placeUpdate.getImageUrl() != null) place.setImageUrl(placeUpdate.getImageUrl());
        if (placeUpdate.getPreviewVideo() != null) place.setPreviewVideo(placeUpdate.getPreviewVideo());
        if (placeUpdate.getProvince() != null) place.setProvince(placeUpdate.getProvince());
        
        place.setUpdatedAt(LocalDateTime.now());
        return placeRepository.save(place);
    }

    @Override
    public void deletePlace(Long placeId) {
        if (!placeRepository.existsById(placeId)) {
            throw new RuntimeException("Place not found with id: " + placeId);
        }
        placeRepository.deleteById(placeId);
    }

    @Override
    public List<PlaceEntity> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Page<PlaceEntity> getAllPlaces(Pageable pageable) {
        return placeRepository.findAll(pageable);
    }

    @Override
    public Page<PlaceEntity> searchPlaces(String searchTerm, Pageable pageable) {
        return placeRepository.searchPlaces(searchTerm, pageable);
    }

    @Override
    public List<PlaceEntity> getPlacesByCategory(String category) {
        return placeRepository.findByCategory(category);
    }

    @Override
    public Page<PlaceEntity> getPlacesByCategory(String category, Pageable pageable) {
        return placeRepository.findByCategory(category, pageable);
    }

    @Override
    public List<PlaceEntity> getPlacesByStatus(String status) {
        return placeRepository.findByStatus(status);
    }

    @Override
    public List<PlaceEntity> getTopRatedPlaces() {
        return placeRepository.findAllByOrderByRatingDesc();
    }

    @Override
    public List<PlaceEntity> getAllHotels() {
        return placeRepository.findAllHotels();
    }

    @Override
    public List<PlaceEntity> getAllRestaurants() {
        return placeRepository.findAllRestaurants();
    }

    @Override
    public List<PlaceEntity> getAllAttractions() {
        return placeRepository.findAllAttractions();
    }

    // === FAVORITES ===
    @Override
    @Transactional
    public Map<String, Object> addToFavorite(Long placeId) {
        PlaceEntity place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));
        favorites.add(placeId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("isFavorited", true);
        result.put("placeId", placeId);
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> removeFromFavorite(Long placeId) {
        favorites.remove(placeId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("isFavorited", false);
        result.put("placeId", placeId);
        return result;
    }

    @Override
    public List<PlaceEntity> getFavoritePlaces() {
        return favorites.stream()
                .map(id -> placeRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlaceEntity> searchPlaces(PlaceSearchRequest request) {
        List<PlaceEntity> allPlaces = placeRepository.findAll();
        
        if (request.getCategory() != null && !request.getCategory().isEmpty()) {
            allPlaces = allPlaces.stream()
                    .filter(p -> request.getCategory().equalsIgnoreCase(p.getCategory()))
                    .collect(Collectors.toList());
        }
        
        if (request.getSearch() != null && !request.getSearch().isEmpty()) {
            String searchLower = request.getSearch().toLowerCase();
            allPlaces = allPlaces.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        if (request.getSortBy() != null && "rating".equals(request.getSortBy())) {
            allPlaces.sort((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0,
                                                     a.getRating() != null ? a.getRating() : 0));
        }
        
        int skip = request.getSkip() != null ? request.getSkip() : 0;
        int limit = request.getLimit() != null ? request.getLimit() : 10;
        int end = Math.min(skip + limit, allPlaces.size());
        return allPlaces.subList(skip, Math.max(0, end));
    }

    @Override
    public PlaceEntity getPlaceDetail(Long placeId) {
        return placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));
    }
}
