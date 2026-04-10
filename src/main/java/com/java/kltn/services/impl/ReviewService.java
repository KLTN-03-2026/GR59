package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    // In-memory storage for reviews keyed by entityType:entityId
    private final Map<String, Map<Long, Map<String, Object>>> reviews = Collections.synchronizedMap(new HashMap<>());
    private Long nextReviewId = 1L;

    public List<Map<String, Object>> getReviews(String entityType, Long entityId, int skip, int limit, String sortBy) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.getOrDefault(key, new HashMap<>());
        List<Map<String, Object>> list = new ArrayList<>(entityReviews.values());
        
        if (sortBy != null && "rating".equals(sortBy)) {
            list.sort((a, b) -> {
                Object ratingA = a.get("rating");
                Object ratingB = b.get("rating");
                if (ratingA instanceof Number && ratingB instanceof Number) {
                    return ((Number) ratingB).intValue() - ((Number) ratingA).intValue();
                }
                return 0;
            });
        }
        
        int end = Math.min(skip + limit, list.size());
        return list.subList(skip, end);
    }

    @Transactional
    public Map<String, Object> createReview(String entityType, Long entityId, Map<String, Object> request) {
        Long reviewId = nextReviewId++;
        String key = entityType + ":" + entityId;
        
        Map<String, Object> review = new HashMap<>(request);
        review.put("id", reviewId);
        review.put("date", LocalDateTime.now().toString());
        review.put("helpful", 0);
        review.put("unhelpful", 0);
        
        reviews.computeIfAbsent(key, k -> new HashMap<>()).put(reviewId, review);
        return review;
    }

    public Map<String, Object> getReviewStats(String entityType, Long entityId) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.getOrDefault(key, new HashMap<>());
        
        double avgRating = entityReviews.values().stream()
                .mapToDouble(r -> {
                    Object rating = r.get("rating");
                    if (rating instanceof Number) return ((Number) rating).doubleValue();
                    return 0;
                })
                .average()
                .orElse(0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("average", avgRating);
        stats.put("total", entityReviews.size());
        stats.put("breakdown", new ArrayList<>());
        return stats;
    }

    @Transactional
    public Map<String, Object> updateReview(String entityType, Long entityId, Long reviewId, Map<String, Object> request) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.get(key);
        
        if (entityReviews != null && entityReviews.containsKey(reviewId)) {
            Map<String, Object> review = entityReviews.get(reviewId);
            review.putAll(request);
            return review;
        }
        return new HashMap<>();
    }

    @Transactional
    public void deleteReview(String entityType, Long entityId, Long reviewId) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.get(key);
        if (entityReviews != null) {
            entityReviews.remove(reviewId);
        }
    }

    @Transactional
    public Map<String, Object> markHelpful(String entityType, Long entityId, Long reviewId) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.get(key);
        
        if (entityReviews != null && entityReviews.containsKey(reviewId)) {
            Map<String, Object> review = entityReviews.get(reviewId);
            Object helpful = review.get("helpful");
            int count = helpful instanceof Number ? ((Number) helpful).intValue() : 0;
            review.put("helpful", count + 1);
            return review;
        }
        return new HashMap<>();
    }

    @Transactional
    public Map<String, Object> markUnhelpful(String entityType, Long entityId, Long reviewId) {
        String key = entityType + ":" + entityId;
        Map<Long, Map<String, Object>> entityReviews = reviews.get(key);
        
        if (entityReviews != null && entityReviews.containsKey(reviewId)) {
            Map<String, Object> review = entityReviews.get(reviewId);
            Object unhelpful = review.get("unhelpful");
            int count = unhelpful instanceof Number ? ((Number) unhelpful).intValue() : 0;
            review.put("unhelpful", count + 1);
            return review;
        }
        return new HashMap<>();
    }

    @Transactional
    public Map<String, Object> reportReview(String entityType, Long entityId, Long reviewId, Map<String, Object> request) {
        Map<String, Object> report = new HashMap<>(request);
        report.put("reviewId", reviewId);
        report.put("entityType", entityType);
        report.put("entityId", entityId);
        report.put("createdAt", LocalDateTime.now().toString());
        return report;
    }

    public List<String> uploadReviewPhotos(MultipartFile[] files) {
        // Simple implementation - in production this would upload to cloud storage
        return Arrays.stream(files)
                .map(f -> "photo_" + System.currentTimeMillis() + "_" + f.getOriginalFilename())
                .collect(Collectors.toList());
    }
}
