package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.entities.PlaceEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.models.request.PlaceSearchRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.IPlaceService;
import com.java.kltn.services.impl.PlaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlaceController {

    private final IPlaceService iPlaceService;
    private final PlaceService placeService;

    // ============ PROVINCES ============
    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<ProvinceEntity>>> getAllProvinces() {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getAllProvinces()));
    }

    @GetMapping("/provinces/{provinceId}")
    public ResponseEntity<ApiResponse<ProvinceEntity>> getProvinceById(@PathVariable Long provinceId) {
        return iPlaceService.getProvinceById(provinceId)
                .map(province -> ResponseEntity.ok(ApiResponse.success(province)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Province not found", 404)));
    }

    @GetMapping("/provinces/{provinceId}/places")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getByProvince(@PathVariable Long provinceId) {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getPlacesByProvince(provinceId)));
    }

    // ============ ALL PLACES ============
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlaceEntity>>> getAllPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PlaceEntity> places = iPlaceService.getAllPlaces(pageable);
        return ResponseEntity.ok(ApiResponse.success(places));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getPlacesList() {
        List<PlaceEntity> places = iPlaceService.getAllPlaces();
        return ResponseEntity.ok(ApiResponse.success(places));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PlaceEntity>>> searchPlaces(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PlaceEntity> places = iPlaceService.searchPlaces(searchTerm, pageable);
        return ResponseEntity.ok(ApiResponse.success(places));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaceEntity>> getPlaceById(@PathVariable Long id) {
        return iPlaceService.getPlaceById(id)
                .map(place -> ResponseEntity.ok(ApiResponse.success(place)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Place not found", 404)));
    }

    // ============ CATEGORY FILTERS ============
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getPlacesByCategory(category)));
    }

    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<ApiResponse<Page<PlaceEntity>>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PlaceEntity> places = iPlaceService.getPlacesByCategory(category, pageable);
        return ResponseEntity.ok(ApiResponse.success(places));
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getPlacesByStatus(status)));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getTopRated() {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getTopRatedPlaces()));
    }

    // ============ SPECIALIZED ENDPOINTS ============
    @GetMapping("/hotels")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getAllHotels() {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getAllHotels()));
    }

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getAllRestaurants() {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getAllRestaurants()));
    }

    @GetMapping("/attractions")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getAllAttractions() {
        return ResponseEntity.ok(ApiResponse.success(iPlaceService.getAllAttractions()));
    }

    // ============ CRUD OPERATIONS ============
    @PostMapping
    public ResponseEntity<ApiResponse<PlaceEntity>> createPlace(@RequestBody PlaceEntity place) {
        try {
            PlaceEntity createdPlace = iPlaceService.createPlace(place);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Place created successfully", createdPlace));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create place: " + e.getMessage(), 400));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaceEntity>> updatePlace(@PathVariable Long id, @RequestBody PlaceEntity place) {
        try {
            PlaceEntity updatedPlace = iPlaceService.updatePlace(id, place);
            return ResponseEntity.ok(ApiResponse.success("Place updated successfully", updatedPlace));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Place not found", 404));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update place: " + e.getMessage(), 400));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PlaceEntity>> patchPlace(@PathVariable Long id, @RequestBody PlaceEntity place) {
        return updatePlace(id, place);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlace(@PathVariable Long id) {
        try {
            iPlaceService.deletePlace(id);
            return ResponseEntity.ok(ApiResponse.success("Place deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Place not found", 404));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete place: " + e.getMessage(), 400));
        }
    }

    // ============ FAVORITES ============
    @PostMapping("/{placeId}/favorites")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addPlaceToFavorite(
            @PathVariable Long placeId) {
        Map<String, Object> result = iPlaceService.addToFavorite(placeId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{placeId}/favorites")
    public ResponseEntity<ApiResponse<Map<String, Object>>> removePlaceFromFavorite(
            @PathVariable Long placeId) {
        Map<String, Object> result = iPlaceService.removeFromFavorite(placeId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getFavoritePlaces() {
        List<PlaceEntity> favorites = iPlaceService.getFavoritePlaces();
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    // ============ ADVANCED SEARCH ============
    @GetMapping("/search/advanced")
    public ResponseEntity<ApiResponse<List<PlaceEntity>>> getPlaces(PlaceSearchRequest request){
        List<PlaceEntity> places = iPlaceService.searchPlaces(request);
        return ResponseEntity.ok(ApiResponse.success(places));
    }
}

