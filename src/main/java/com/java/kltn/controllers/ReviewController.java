package com.java.kltn.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.ReviewService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{entityType}s/{entityId}/reviews")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReviews(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String sortBy) {
        List<Map<String, Object>> reviews = reviewService.getReviews(entityType, entityId, skip, limit, sortBy);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PostMapping("/{entityType}s/{entityId}/reviews")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createReview(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> review = reviewService.createReview(entityType, entityId, request);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @GetMapping("/{entityType}s/{entityId}/review-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReviewStats(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        Map<String, Object> stats = reviewService.getReviewStats(entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PatchMapping("/{entityType}s/{entityId}/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateReview(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Long reviewId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> review = reviewService.updateReview(entityType, entityId, reviewId, request);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @DeleteMapping("/{entityType}s/{entityId}/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteReview(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(entityType, entityId, reviewId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/{entityType}s/{entityId}/reviews/{reviewId}/helpful")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markHelpful(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Long reviewId) {
        Map<String, Object> review = reviewService.markHelpful(entityType, entityId, reviewId);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping("/{entityType}s/{entityId}/reviews/{reviewId}/unhelpful")
    public ResponseEntity<ApiResponse<Map<String, Object>>> markUnhelpful(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Long reviewId) {
        Map<String, Object> review = reviewService.markUnhelpful(entityType, entityId, reviewId);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping("/{entityType}s/{entityId}/reviews/{reviewId}/report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reportReview(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @PathVariable Long reviewId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> report = reviewService.reportReview(entityType, entityId, reviewId, request);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @PostMapping("/reviews/upload-photos")
    public ResponseEntity<ApiResponse<List<String>>> uploadReviewPhotos(
            @RequestParam("files") MultipartFile[] files) {
        List<String> urls = reviewService.uploadReviewPhotos(files);
        return ResponseEntity.ok(ApiResponse.success(urls));
    }

    @PostMapping("/reviews/delete-photo")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deletePhoto(
            @RequestBody Map<String, String> request) {
        // TODO: Implement delete photo
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Photo deleted", result));
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<ApiResponse<Object[]>> getUserReviews(
            @PathVariable Long userId) {
        // TODO: Implement get user reviews
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }
}
