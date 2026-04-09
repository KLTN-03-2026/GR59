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

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.NewsService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllNews(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String sortBy) {
        List<Map<String, Object>> news = newsService.getAllNews(skip, limit, sortBy);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFeaturedNews(
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> news = newsService.getFeaturedNews(limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @GetMapping("/{newsId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNewsDetail(
            @PathVariable Long newsId) {
        Map<String, Object> news = newsService.getNewsDetail(newsId);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNewsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> news = newsService.getNewsByCategory(category, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchNews(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> news = newsService.searchNews(keyword, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @GetMapping("/{newsId}/related")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRelatedNews(
            @PathVariable Long newsId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> news = newsService.getRelatedNews(newsId, limit);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createNews(
            @RequestBody Map<String, Object> request) {
        Map<String, Object> news = newsService.createNews(request);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @PatchMapping("/{newsId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateNews(
            @PathVariable Long newsId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> news = newsService.updateNews(newsId, request);
        return ResponseEntity.ok(ApiResponse.success(news));
    }

    @DeleteMapping("/{newsId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteNews(
            @PathVariable Long newsId) {
        newsService.deleteNews(newsId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNewsCategories() {
        List<Map<String, Object>> categories = newsService.getNewsCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createNewsCategory(
            @RequestBody Map<String, String> request) {
        Map<String, Object> category = newsService.createNewsCategory(request);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PostMapping("/{newsId}/like")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> likeNews(
            @PathVariable Long newsId) {
        // TODO: Implement like news
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Liked", result));
    }

    @DeleteMapping("/{newsId}/like")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> unlikeNews(
            @PathVariable Long newsId) {
        // TODO: Implement unlike news
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Unliked", result));
    }

    @PostMapping("/{newsId}/share")
    public ResponseEntity<ApiResponse<Map<String, Object>>> shareNews(
            @PathVariable Long newsId,
            @RequestParam String platform) {
        // TODO: Implement share news
        return ResponseEntity.ok(ApiResponse.success("News shared", new HashMap<>()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> subscribeNewsletter(
            @RequestBody Map<String, Object> request) {
        // TODO: Implement subscribe newsletter
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Subscribed", result));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> unsubscribeNewsletter(
            @RequestBody Map<String, String> request) {
        // TODO: Implement unsubscribe newsletter
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Unsubscribed", result));
    }

    @GetMapping("/{newsId}/comments")
    public ResponseEntity<ApiResponse<Object[]>> getNewsComments(
            @PathVariable Long newsId,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        // TODO: Implement get news comments
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }

    @PostMapping("/{newsId}/comments")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createNewsComment(
            @PathVariable Long newsId,
            @RequestBody Map<String, String> request) {
        // TODO: Implement create news comment
        return ResponseEntity.ok(ApiResponse.success("Comment created", new HashMap<>()));
    }

    @DeleteMapping("/{newsId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteNewsComment(
            @PathVariable Long newsId,
            @PathVariable Long commentId) {
        // TODO: Implement delete news comment
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", result));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<Object[]>> getPopularNews(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String timeRange) {
        // TODO: Implement get popular news
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<Object[]>> getTrendingNews(
            @RequestParam(defaultValue = "5") int limit) {
        // TODO: Implement get trending news
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }
}
