package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.BookingService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createBooking(
            @RequestBody Map<String, Object> request) {
        Map<String, Object> booking = bookingService.createBooking(request);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getUserBookings(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> bookings = bookingService.getUserBookings(skip, limit, status);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBookingDetail(
            @PathVariable Long bookingId) {
        Map<String, Object> booking = bookingService.getBookingDetail(bookingId);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PatchMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> booking = bookingService.updateBooking(bookingId, request);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason) {
        Map<String, Object> booking = bookingService.cancelBooking(bookingId, reason);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PatchMapping("/{bookingId}/confirm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmBooking(
            @PathVariable Long bookingId) {
        Map<String, Object> booking = bookingService.confirmBooking(bookingId);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }
}
