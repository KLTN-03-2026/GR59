package com.java.kltn.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.entities.TripEntity;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.dto.GenerateTripResponse;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.TripService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;

    // === TRIP CRUD ===
    @PostMapping
    public ResponseEntity<ApiResponse<TripEntity>> createTrip(
            @RequestBody Map<String, Object> tripData,
            @AuthenticationPrincipal UserEntity user) {
        TripEntity trip = tripService.createTrip(tripData, user);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripEntity>>> getMyTrips(
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserEntity user) {
        List<TripEntity> trips = status != null 
            ? tripService.getUserTripsByStatus(user, status)
            : tripService.getUserTrips(user);
        return ResponseEntity.ok(ApiResponse.success(trips));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripEntity>> getTripDetail(@PathVariable Long tripId) {
        TripEntity trip = tripService.getTripDetail(tripId);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @PatchMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripEntity>> updateTrip(
            @PathVariable Long tripId,
            @RequestBody Map<String, Object> updateData) {
        TripEntity trip = tripService.updateTrip(tripId, updateData);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteTrip(@PathVariable Long tripId) {
        tripService.deleteTrip(tripId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // === CHECKLIST ===
    @PostMapping("/{tripId}/checklist-item")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createChecklistItem(
            @PathVariable Long tripId,
            @RequestBody Map<String, Object> itemData) {
        String label = (String) itemData.get("label");
        Map<String, Object> result = tripService.addChecklistItem(tripId, label);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/{tripId}/checklist-item")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateChecklistItem(
            @PathVariable Long tripId,
            @RequestBody Map<String, Object> itemData) {
        Map<String, Object> result = tripService.updateChecklistItem(tripId, itemData);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{tripId}/checklist-item")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteChecklistItem(
            @PathVariable Long tripId,
            @RequestParam Long itemId) {
        tripService.deleteChecklistItem(tripId, itemId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/{tripId}/checklist")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> updateChecklist(
            @PathVariable Long tripId,
            @RequestBody List<Map<String, Object>> checklistData) {
        List<Map<String, Object>> result = tripService.updateFullChecklist(tripId, checklistData);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // === EXPENSES ===
    @GetMapping("/{tripId}/expenses")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getExpenses(@PathVariable Long tripId) {
        List<Map<String, Object>> expenses = tripService.getTripExpenses(tripId);
        return ResponseEntity.ok(ApiResponse.success(expenses));
    }

    @PostMapping("/{tripId}/expenses")
    public ResponseEntity<ApiResponse<Map<String, Object>>> addExpense(
            @PathVariable Long tripId,
            @RequestBody Map<String, Object> expenseData) {
        Map<String, Object> result = tripService.addExpense(tripId, expenseData);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/{tripId}/expenses/{expenseId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateExpense(
            @PathVariable Long tripId,
            @PathVariable String expenseId,
            @RequestBody Map<String, Object> expenseData) {
        Map<String, Object> result = tripService.updateExpense(tripId, expenseId, expenseData);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{tripId}/expenses/{expenseId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId) {
        tripService.deleteExpense(tripId, expenseId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // === AI TRIP SAVE ===
    @PostMapping("/save")
    public ResponseEntity<ApiResponse<TripEntity>> saveTrip(
            @RequestBody GenerateTripResponse aiResponse,
            @AuthenticationPrincipal UserEntity user) {
        TripEntity trip = tripService.saveTripFromAI(aiResponse, user);
        return ResponseEntity.ok(ApiResponse.success(trip));
    }

    @GetMapping("/my-trips")
    public ResponseEntity<ApiResponse<List<TripEntity>>> getMyTripsLegacy(
            @AuthenticationPrincipal UserEntity user) {
        return ResponseEntity.ok(ApiResponse.success(tripService.getUserTrips(user)));
    }
}

