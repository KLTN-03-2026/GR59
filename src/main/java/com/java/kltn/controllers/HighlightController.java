package com.java.kltn.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
public class HighlightController {

    @GetMapping("/highlight_locations")
    public ResponseEntity<ApiResponse<Object[]>> getHighlightLocations() {
        // TODO: Implement get highlight locations
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }

    @GetMapping("/highlight_hotels")
    public ResponseEntity<ApiResponse<Object[]>> getHighlightHotels() {
        // TODO: Implement get highlight hotels
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }

    @GetMapping("/highlight_restaurants")
    public ResponseEntity<ApiResponse<Object[]>> getHighlightRestaurants() {
        // TODO: Implement get highlight restaurants
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }
}
