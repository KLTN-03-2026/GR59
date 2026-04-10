package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.SearchService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> globalSearch(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> results = searchService.globalSearch(q, category, location, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> results = searchService.searchByCategory(category, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchByLocation(
            @PathVariable String location,
            @RequestParam(required = false) Integer radius,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> results = searchService.searchByLocation(location, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTrendingDestinations(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> results = searchService.getTrendingDestinations(limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPopularDestinations(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> results = searchService.getPopularDestinations(limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<ApiResponse<List<String>>> autocomplete(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") int limit) {
        List<String> results = searchService.autocomplete(keyword, limit);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Map<String, Object>>> saveSearch(
            @RequestBody Map<String, Object> request) {
        Map<String, Object> saved = searchService.saveSearch(request);
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSavedSearches() {
        List<Map<String, Object>> saved = searchService.getSavedSearches();
        return ResponseEntity.ok(ApiResponse.success(saved));
    }

    @DeleteMapping("/saved/{searchId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteSavedSearch(
            @PathVariable String searchId) {
        searchService.deleteSavedSearch(searchId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
