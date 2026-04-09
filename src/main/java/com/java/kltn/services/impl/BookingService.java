package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    // In-memory storage for bookings (replace with proper repository in production)
    private final Map<Long, Map<String, Object>> bookings = Collections.synchronizedMap(new HashMap<>());
    private Long nextBookingId = 1L;

    @Transactional
    public Map<String, Object> createBooking(Map<String, Object> request) {
        Long bookingId = nextBookingId++;
        
        Map<String, Object> booking = new HashMap<>(request);
        booking.put("id", bookingId);
        booking.put("status", "pending");
        booking.put("paymentStatus", "unpaid");
        booking.put("createdAt", LocalDateTime.now().toString());
        
        bookings.put(bookingId, booking);
        return booking;
    }

    public List<Map<String, Object>> getUserBookings(int skip, int limit, String status) {
        List<Map<String, Object>> allBookings = new ArrayList<>(bookings.values());
        
        if (status != null && !status.isEmpty()) {
            allBookings = allBookings.stream()
                    .filter(b -> status.equals(b.get("status")))
                    .collect(Collectors.toList());
        }
        
        int end = Math.min(skip + limit, allBookings.size());
        return allBookings.subList(skip, end);
    }

    public Map<String, Object> getBookingDetail(Long bookingId) {
        return bookings.getOrDefault(bookingId, new HashMap<>());
    }

    @Transactional
    public Map<String, Object> updateBooking(Long bookingId, Map<String, Object> request) {
        Map<String, Object> booking = bookings.get(bookingId);
        if (booking != null) {
            booking.putAll(request);
            booking.put("updatedAt", LocalDateTime.now().toString());
            bookings.put(bookingId, booking);
        }
        return booking;
    }

    @Transactional
    public Map<String, Object> cancelBooking(Long bookingId, String reason) {
        Map<String, Object> booking = bookings.get(bookingId);
        if (booking != null) {
            booking.put("status", "cancelled");
            if (reason != null) {
                booking.put("cancellationReason", reason);
            }
            booking.put("updatedAt", LocalDateTime.now().toString());
            bookings.put(bookingId, booking);
        }
        return booking;
    }

    @Transactional
    public Map<String, Object> confirmBooking(Long bookingId) {
        Map<String, Object> booking = bookings.get(bookingId);
        if (booking != null) {
            booking.put("status", "confirmed");
            booking.put("updatedAt", LocalDateTime.now().toString());
            bookings.put(bookingId, booking);
        }
        return booking;
    }
}
