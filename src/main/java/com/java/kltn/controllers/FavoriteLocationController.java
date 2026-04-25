package com.java.kltn.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.dto.FavoriteLocationDTO;
import com.java.kltn.models.request.AddFavoriteLocationRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.FavoriteLocationService;
import com.java.kltn.utils.MessageKeys;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/favorites")
@CrossOrigin(origins = "*")
public class FavoriteLocationController {

    private final FavoriteLocationService favoriteLocationService;
    private final LocalizationUtils localizationUtils;

    /**
     * Lấy ID của user hiện tại
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        return user.getId();
    }

    /**
     * Thêm địa điểm vào danh sách yêu thích
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteLocationDTO>> addFavorite(
            @Valid @RequestBody AddFavoriteLocationRequest request) {
        try {
            Long userId = getCurrentUserId();
            FavoriteLocationDTO favorite = favoriteLocationService.addFavorite(userId, request);
            String message = localizationUtils.getLocalizedMessage("favorite.added_success");
            ApiResponse<FavoriteLocationDTO> response = ApiResponse.success(message, favorite);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            ApiResponse<FavoriteLocationDTO> response = ApiResponse.error(message, 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Xóa địa điểm khỏi danh sách yêu thích
     */
    @DeleteMapping("/{locationId}")
    public ResponseEntity<ApiResponse<String>> removeFavorite(
            @PathVariable Long locationId,
            @RequestParam String locationType) {
        try {
            Long userId = getCurrentUserId();
            favoriteLocationService.removeFavorite(userId, locationId, locationType);
            String message = localizationUtils.getLocalizedMessage("favorite.removed_success");
            ApiResponse<String> response = ApiResponse.success(message, "");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String message = e.getMessage();
            ApiResponse<String> response = ApiResponse.error(message, 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Lấy danh sách yêu thích của user hiện tại (có phân trang)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<FavoriteLocationDTO>>> getUserFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Long userId = getCurrentUserId();
            Pageable pageable = PageRequest.of(page, size);
            Page<FavoriteLocationDTO> favorites = favoriteLocationService.getUserFavorites(userId, pageable);
            String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
            ApiResponse<Page<FavoriteLocationDTO>> response = ApiResponse.success(message, favorites);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage();
            ApiResponse<Page<FavoriteLocationDTO>> response = ApiResponse.error(message, 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Lấy danh sách yêu thích của user hiện tại (không phân trang)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FavoriteLocationDTO>>> getAllUserFavorites() {
        try {
            Long userId = getCurrentUserId();
            List<FavoriteLocationDTO> favorites = favoriteLocationService.getUserFavoritesList(userId);
            String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
            ApiResponse<List<FavoriteLocationDTO>> response = ApiResponse.success(message, favorites);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage();
            ApiResponse<List<FavoriteLocationDTO>> response = ApiResponse.error(message, 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Kiểm tra user đã yêu thích địa điểm này chưa
     */
    @GetMapping("/check/{locationId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkFavorite(
            @PathVariable Long locationId,
            @RequestParam String locationType) {
        try {
            Long userId = getCurrentUserId();
            boolean isFavorite = favoriteLocationService.isFavorite(userId, locationId, locationType);

            Map<String, Object> data = new HashMap<>();
            data.put("isFavorite", isFavorite);
            data.put("locationId", locationId);
            data.put("locationType", locationType);

            String message = localizationUtils.getLocalizedMessage("favorite.check_success");
            ApiResponse<Map<String, Object>> response = ApiResponse.success(message, data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage();
            ApiResponse<Map<String, Object>> response = ApiResponse.error(message, 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Đếm số lượng yêu thích của một địa điểm
     */
    @GetMapping("/count/{locationId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFavoriteCount(
            @PathVariable Long locationId,
            @RequestParam String locationType) {
        try {
            Long count = favoriteLocationService.getFavoriteCount(locationId, locationType);

            Map<String, Object> data = new HashMap<>();
            data.put("count", count);
            data.put("locationId", locationId);
            data.put("locationType", locationType);

            String message = localizationUtils.getLocalizedMessage("favorite.count_success");
            ApiResponse<Map<String, Object>> response = ApiResponse.success(message, data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String message = e.getMessage();
            ApiResponse<Map<String, Object>> response = ApiResponse.error(message, 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
