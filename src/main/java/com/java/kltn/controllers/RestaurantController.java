package com.java.kltn.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.dto.RestaurantDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.RestaurantService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final LocalizationUtils localizationUtils;
    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getAllRestaurants(pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<RestaurantDTO>> response = ApiResponse.success(message, restaurants);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantDTO>> getRestaurantById(@PathVariable Long id) {
        RestaurantDTO restaurant = restaurantService.getRestaurantById(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_SUCCESS);
        ApiResponse<RestaurantDTO> response = ApiResponse.success(message, restaurant);
        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<RestaurantDTO>> createRestaurant(
            @RequestPart("restaurant") RestaurantDTO request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles
    ) {
        RestaurantDTO restaurant = restaurantService.createRestaurant(request, imageFile, galleryFiles);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_CREATE_SUCCESS);
        ApiResponse<RestaurantDTO> response = ApiResponse.success(message, 201, restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<RestaurantDTO>> updateRestaurant(
            @PathVariable Long id,
            @RequestPart(value = "restaurant", required = false) RestaurantDTO request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles
    ) {
        RestaurantDTO restaurant = restaurantService.updateRestaurant(id, request, imageFile, galleryFiles);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_UPDATE_SUCCESS);
        ApiResponse<RestaurantDTO> response = ApiResponse.success(message, restaurant);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_DELETE_SUCCESS);
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }

    // Search by name
    @GetMapping("/search/by-name")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchByName(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchByName(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm nhà hàng theo tên", restaurants));
    }

    // Search by location
    @GetMapping("/search/by-location")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchByLocation(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchByLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm nhà hàng theo địa điểm", restaurants));
    }

    // Search by name or location
    @GetMapping("/search/by-keyword")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchByNameOrLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm nhà hàng theo tên hoặc địa điểm", restaurants));
    }

    // Search by name in province
    @GetMapping("/search/province/{provinceId}/by-name")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchByNameInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchByNameAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm nhà hàng theo tên trong tỉnh", restaurants));
    }

    // Search by location in province
    @GetMapping("/search/province/{provinceId}/by-location")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchByLocationInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchByLocationAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm nhà hàng theo địa điểm trong tỉnh", restaurants));
    }
}
