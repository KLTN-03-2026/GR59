package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.DestinationService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*")
public class DestinationController {

    private final DestinationService destinationService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchDestinations(
            @RequestParam String q) {
        List<Map<String, Object>> results = destinationService.searchDestinations(q);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDestinationBySlug(
            @PathVariable String slug) {
        Map<String, Object> destination = destinationService.getDestinationBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(destination));
    }

    @GetMapping("/{destinationId}/reviews")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDestinationReviews(
            @PathVariable Long destinationId,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> reviews = destinationService.getDestinationReviews(destinationId, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/{destinationId}/services")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDestinationServices(
            @PathVariable Long destinationId,
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> services = destinationService.getDestinationServices(destinationId, type, skip, limit);
        return ResponseEntity.ok(ApiResponse.success(services));
    }
}
