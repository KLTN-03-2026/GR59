package com.java.kltn.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.models.responses.ItineraryResponse;
import com.java.kltn.services.impl.ItineraryService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;

/**
 * Controller for travel itinerary demo endpoints
 * TODO: Replace with AI-generated itineraries in the future
 */
@RestController
@RequestMapping("/api/v1/travel/itineraries")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TravelItineraryDemoController {

    private final ItineraryService itineraryService;
    private final LocalizationUtils localizationUtils;

    /**
     * Get demo itinerary detail
     * This is temporary data - will be replaced with AI-generated itineraries
     */
    @GetMapping("/demo")
    public ResponseEntity<ApiResponse<ItineraryResponse>> getDemoItinerary() {
        ItineraryResponse itinerary = itineraryService.getDemoItinerary();
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        return ResponseEntity.ok(ApiResponse.success(message, itinerary));
    }

    /**
     * Get all demo itineraries (list view)
     */
    @GetMapping("/demo/all")
    public ResponseEntity<ApiResponse<List<ItineraryResponse>>> getAllDemoItineraries() {
        List<ItineraryResponse> itineraries = itineraryService.getAllDemoItineraries();
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        return ResponseEntity.ok(ApiResponse.success(message, itineraries));
    }

    /**
     * Get demo itinerary by ID (placeholder for future AI generation)
     * Currently returns the same demo data
     */
    @GetMapping("/demo/{id}")
    public ResponseEntity<ApiResponse<ItineraryResponse>> getDemoItineraryById(@PathVariable String id) {
        ItineraryResponse itinerary = itineraryService.getDemoItinerary();
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        return ResponseEntity.ok(ApiResponse.success(message, itinerary));
    }
}
