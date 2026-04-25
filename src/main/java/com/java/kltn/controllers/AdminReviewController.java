package com.java.kltn.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.dto.ReviewDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.ReviewService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;

/**
 * Admin Review Controller
 * Các endpoints dành riêng cho Admin quản lý đánh giá
 * - Xem tất cả đánh giá (bao gồm HIDDEN)
 * - Thay đổi trạng thái đánh giá
 * Base path: /api/v1/admin/reviews
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/reviews")
@CrossOrigin(origins = "*")
public class AdminReviewController {

    private final LocalizationUtils localizationUtils;
    private final ReviewService reviewService;

    /**
     * Lấy tất cả đánh giá (bao gồm ACTIVE, HIDDEN, PENDING)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getAllReviewsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDTO> reviews = reviewService.getAllReviewsForAdmin(pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<ReviewDTO>> response = ApiResponse.success(message, reviews);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết đánh giá theo ID (Admin)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewDTO>> getReviewDetailForAdmin(@PathVariable Long id) {
        ReviewDTO review = reviewService.getReviewById(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<ReviewDTO> response = ApiResponse.success(message, review);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả đánh giá của khách sạn (bao gồm HIDDEN)
     */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getReviewsByHotelForAdmin(
            @PathVariable Long hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDTO> reviews = reviewService.getReviewsByHotelForAdmin(hotelId, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<ReviewDTO>> response = ApiResponse.success(message, reviews);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả đánh giá của nhà hàng (bao gồm HIDDEN)
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getReviewsByRestaurantForAdmin(
            @PathVariable Long restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDTO> reviews = reviewService.getReviewsByRestaurantForAdmin(restaurantId, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<ReviewDTO>> response = ApiResponse.success(message, reviews);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả đánh giá của địa điểm (bao gồm HIDDEN)
     */
    @GetMapping("/attraction/{attractionId}")
    public ResponseEntity<ApiResponse<Page<ReviewDTO>>> getReviewsByAttractionForAdmin(
            @PathVariable Long attractionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ReviewDTO> reviews = reviewService.getReviewsByAttractionForAdmin(attractionId, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<ReviewDTO>> response = ApiResponse.success(message, reviews);
        return ResponseEntity.ok(response);
    }

    /**
     * API cho Admin: Thay đổi trạng thái của đánh giá (ACTIVE, HIDDEN, PENDING)
     * Ví dụ: PATCH /api/v1/admin/reviews/{id}/status?status=HIDDEN
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReviewDTO>> changeReviewStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ReviewDTO review = reviewService.changeStatus(id, status);
        ApiResponse<ReviewDTO> response = ApiResponse.success("Cập nhật trạng thái thành công", review);
        return ResponseEntity.ok(response);
    }

    /**
     * API cho Admin: Ẩn đánh giá (đặt status = HIDDEN)
     */
    @PutMapping("/{id}/hide")
    public ResponseEntity<ApiResponse<ReviewDTO>> hideReview(@PathVariable Long id) {
        ReviewDTO review = reviewService.hideReview(id);
        ApiResponse<ReviewDTO> response = ApiResponse.success("Đánh giá đã được ẩn", review);
        return ResponseEntity.ok(response);
    }

    /**
     * API cho Admin: Hiện lại đánh giá (đặt status = ACTIVE)
     */
    @PutMapping("/{id}/show")
    public ResponseEntity<ApiResponse<ReviewDTO>> showReview(@PathVariable Long id) {
        ReviewDTO review = reviewService.showReview(id);
        ApiResponse<ReviewDTO> response = ApiResponse.success("Đánh giá đã được hiện", review);
        return ResponseEntity.ok(response);
    }
}
