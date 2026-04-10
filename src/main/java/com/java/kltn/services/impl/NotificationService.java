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
public class NotificationService {

    // In-memory storage for notifications
    private final Map<Long, Map<String, Object>> notifications = Collections.synchronizedMap(new HashMap<>());
    private Long nextNotificationId = 1L;

    public List<Map<String, Object>> getNotifications(int skip, int limit, Boolean read) {
        List<Map<String, Object>> allNotifications = new ArrayList<>(notifications.values());
        
        if (read != null) {
            allNotifications = allNotifications.stream()
                    .filter(n -> read.equals(n.get("read")))
                    .collect(Collectors.toList());
        }
        
        int end = Math.min(skip + limit, allNotifications.size());
        return allNotifications.subList(skip, end);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Map<String, Object> notification = notifications.get(notificationId);
        if (notification != null) {
            notification.put("read", true);
            notification.put("updatedAt", LocalDateTime.now().toString());
            notifications.put(notificationId, notification);
        }
    }

    @Transactional
    public void markAllAsRead() {
        notifications.values().forEach(n -> {
            n.put("read", true);
            n.put("updatedAt", LocalDateTime.now().toString());
        });
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notifications.remove(notificationId);
    }

    @Transactional
    public void deleteAllNotifications() {
        notifications.clear();
    }

    public int getUnreadCount() {
        return (int) notifications.values().stream()
                .filter(n -> !((Boolean) n.getOrDefault("read", false)))
                .count();
    }

    public void createNotification(Map<String, Object> notificationData) {
        Long id = nextNotificationId++;
        Map<String, Object> notification = new HashMap<>(notificationData);
        notification.put("id", id);
        notification.put("read", false);
        notification.put("createdAt", LocalDateTime.now().toString());
        notifications.put(id, notification);
    }
}
