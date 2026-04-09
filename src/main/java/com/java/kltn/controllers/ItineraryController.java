package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

//import com.java.kltn.models.request.ItineraryFilterRequest;
//import com.java.kltn.models.request.ItineraryLocationFilterRequest;
//import com.java.kltn.models.request.ItineraryPriceFilterRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.ItineraryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/itineraries")
@CrossOrigin(origins = "*")
public class ItineraryController {

    private final ItineraryService itineraryService;

//    @GetMapping
//    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllItineraries(
//            @Valid ItineraryFilterRequest request) {
//        List<Map<String, Object>> itineraries = itineraryService.getAllItineraries(request);
//        return ResponseEntity.ok(ApiResponse.success(itineraries));
//    }

    @GetMapping("/{itineraryId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getItineraryDetail(
            @PathVariable Long itineraryId) {
        Map<String, Object> itinerary = itineraryService.getItineraryDetail(itineraryId);
        return ResponseEntity.ok(ApiResponse.success(itinerary));
    }

    @PostMapping("/{itineraryId}/create-trip")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createTripFromItinerary(
            @PathVariable Long itineraryId,
            @RequestBody(required = false) Map<String, Object> request) {
        Map<String, Object> trip = itineraryService.createTripFromItinerary(itineraryId, request);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PostMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecommendations(
            @RequestBody Map<String, Object> params) {
        List<Map<String, Object>> recommendations = itineraryService.getRecommendations(params);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }

    @GetMapping("/{itineraryId}/similar")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSimilarItineraries(
            @PathVariable Long itineraryId,
            @RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> similar = itineraryService.getSimilarItineraries(itineraryId, limit);
        return ResponseEntity.ok(ApiResponse.success(similar));
    }

//    @GetMapping("/price")
//    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getItinerariesByPrice(
//            @Valid ItineraryPriceFilterRequest request) {
//        List<Map<String, Object>> itineraries = itineraryService.getItinerariesByPrice(request);
//        return ResponseEntity.ok(ApiResponse.success(itineraries));
//    }
//
//    @GetMapping("/location/{location}")
//    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getItinerariesByLocation(
//            @PathVariable String location,
//            @Valid ItineraryLocationFilterRequest request) {
//        List<Map<String, Object>> itineraries = itineraryService.getItinerariesByLocation(location, request.getSkip(), request.getLimit());
//        return ResponseEntity.ok(ApiResponse.success(itineraries));
//    }
}
