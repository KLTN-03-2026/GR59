package com.java.kltn.services;

import com.java.kltn.enums.ItemType;

/**
 * Service for tracking user activities
 * Used to build user profile for recommendations
 */
public interface ITrackingService {

    void trackView(Long userId, Long itemId, ItemType itemType);

    void trackBookmark(Long userId, Long itemId, ItemType itemType);

    void trackClick(Long userId, Long itemId, ItemType itemType);

    void trackRating(Long userId, Long itemId, ItemType itemType, Integer rating);

    void trackBooking(Long userId, Long itemId, ItemType itemType);

    void incrementViewCount(Long itemId, ItemType itemType);

    void incrementBookmarkCount(Long itemId, ItemType itemType);

    void incrementBookingCount(Long itemId, ItemType itemType);

    void updateTrendingScore();
}
