package com.java.kltn.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.OSMImportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/osm")
@Slf4j
public class AdminOSMImportController {

    private final OSMImportService osmImportService;

    /**
     * Import Hotels từ OpenStreetMap
     * POST /api/v1/admin/osm/import/hotels?cityName=Hanoi&provinceId=1
     */
    @PostMapping("/import/hotels")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> importHotels(
            @RequestParam String cityName,
            @RequestParam Long provinceId) {
        try {
            int count = osmImportService.importHotelsFromOSM(cityName, provinceId);
            String message = String.format("Successfully imported %d hotels from OpenStreetMap for %s", count, cityName);
            ApiResponse<String> response = ApiResponse.success(message, 200, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error importing hotels", e);
            ApiResponse<String> response = ApiResponse.error("Failed to import hotels: " + e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Import Restaurants từ OpenStreetMap
     * POST /api/v1/admin/osm/import/restaurants?cityName=Hanoi&provinceId=1
     */
    @PostMapping("/import/restaurants")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> importRestaurants(
            @RequestParam String cityName,
            @RequestParam Long provinceId) {
        try {
            int count = osmImportService.importRestaurantsFromOSM(cityName, provinceId);
            String message = String.format("Successfully imported %d restaurants from OpenStreetMap for %s", count, cityName);
            ApiResponse<String> response = ApiResponse.success(message, 200, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error importing restaurants", e);
            ApiResponse<String> response = ApiResponse.error("Failed to import restaurants: " + e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Import Attractions từ OpenStreetMap
     * POST /api/v1/admin/osm/import/attractions?cityName=Hanoi&provinceId=1
     */
    @PostMapping("/import/attractions")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> importAttractions(
            @RequestParam String cityName,
            @RequestParam Long provinceId) {
        try {
            int count = osmImportService.importAttractionsFromOSM(cityName, provinceId);
            String message = String.format("Successfully imported %d attractions from OpenStreetMap for %s", count, cityName);
            ApiResponse<String> response = ApiResponse.success(message, 200, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error importing attractions", e);
            ApiResponse<String> response = ApiResponse.error("Failed to import attractions: " + e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Import All (Hotels, Restaurants, Attractions)
     * POST /api/v1/admin/osm/import/all?cityName=Hanoi&provinceId=1
     */
    @PostMapping("/import/all")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> importAll(
            @RequestParam String cityName,
            @RequestParam Long provinceId) {
        try {
            int hotelCount = osmImportService.importHotelsFromOSM(cityName, provinceId);
            int restaurantCount = osmImportService.importRestaurantsFromOSM(cityName, provinceId);
            int attractionCount = osmImportService.importAttractionsFromOSM(cityName, provinceId);

            String message = String.format(
                    "Successfully imported from OpenStreetMap for %s: %d hotels, %d restaurants, %d attractions",
                    cityName, hotelCount, restaurantCount, attractionCount
            );
            ApiResponse<String> response = ApiResponse.success(message, 200, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error importing data", e);
            ApiResponse<String> response = ApiResponse.error("Failed to import data: " + e.getMessage(), 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
