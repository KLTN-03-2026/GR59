package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.NotificationService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNotifications(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Boolean read) {
        List<Map<String, Object>> notifications = notificationService.getNotifications(skip, limit, read);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> markAsRead(
            @PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> markAllAsRead() {
        notificationService.markAllAsRead();
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteNotification(
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteAllNotifications() {
        notificationService.deleteAllNotifications();
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getUnreadCount() {
        Map<String, Integer> result = new java.util.HashMap<>();
        result.put("unreadCount", notificationService.getUnreadCount());
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
