package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.entities.UserActivityEntity;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.enums.ActivityType;
import com.java.kltn.enums.ItemType;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.RestaurantRepository;
import com.java.kltn.repositories.UserActivityRepository;
import com.java.kltn.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TrackingService implements ITrackingService {

    private final UserActivityRepository userActivityRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final HotelRepository hotelRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public void trackView(Long userId, Long itemId, ItemType itemType) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        UserActivityEntity activity = UserActivityEntity.builder()
                .user(user)
                .itemId(itemId)
                .itemType(itemType)
                .actionType(ActivityType.VIEW)
                .build();

        userActivityRepository.save(activity);
        incrementViewCount(itemId, itemType);

        log.info("Tracked VIEW: userId={}, itemId={}, itemType={}", userId, itemId, itemType);
    }

    @Override
    public void trackBookmark(Long userId, Long itemId, ItemType itemType) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        UserActivityEntity activity = UserActivityEntity.builder()
                .user(user)
                .itemId(itemId)
                .itemType(itemType)
                .actionType(ActivityType.BOOKMARK)
                .build();

        userActivityRepository.save(activity);
        incrementBookmarkCount(itemId, itemType);

        log.info("Tracked BOOKMARK: userId={}, itemId={}, itemType={}", userId, itemId, itemType);
    }

    @Override
    public void trackClick(Long userId, Long itemId, ItemType itemType) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        UserActivityEntity activity = UserActivityEntity.builder()
                .user(user)
                .itemId(itemId)
                .itemType(itemType)
                .actionType(ActivityType.CLICK)
                .build();

        userActivityRepository.save(activity);

        log.info("Tracked CLICK: userId={}, itemId={}, itemType={}", userId, itemId, itemType);
    }

    @Override
    public void trackRating(Long userId, Long itemId, ItemType itemType, Integer rating) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        UserActivityEntity activity = UserActivityEntity.builder()
                .user(user)
                .itemId(itemId)
                .itemType(itemType)
                .actionType(ActivityType.RATE)
                .metadata(String.valueOf(rating))
                .build();

        userActivityRepository.save(activity);

        log.info("Tracked RATE: userId={}, itemId={}, itemType={}, rating={}", userId, itemId, itemType, rating);
    }

    @Override
    public void trackBooking(Long userId, Long itemId, ItemType itemType) {
        UserEntity user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        UserActivityEntity activity = UserActivityEntity.builder()
                .user(user)
                .itemId(itemId)
                .itemType(itemType)
                .actionType(ActivityType.BOOK)
                .build();

        userActivityRepository.save(activity);
        incrementBookingCount(itemId, itemType);

        log.info("Tracked BOOKING: userId={}, itemId={}, itemType={}", userId, itemId, itemType);
    }

    @Override
    public void incrementViewCount(Long itemId, ItemType itemType) {
        switch (itemType) {
            case ATTRACTION:
                AttractionEntity attraction = attractionRepository.findById(itemId).orElse(null);
                if (attraction != null) {
                    attraction.setViewCount((attraction.getViewCount() != null ? attraction.getViewCount() : 0) + 1);
                    attractionRepository.save(attraction);
                }
                break;
            case HOTEL:
                HotelEntity hotel = hotelRepository.findById(itemId).orElse(null);
                if (hotel != null) {
                    hotel.setViewCount((hotel.getViewCount() != null ? hotel.getViewCount() : 0) + 1);
                    hotelRepository.save(hotel);
                }
                break;
            case RESTAURANT:
                RestaurantEntity restaurant = restaurantRepository.findById(itemId).orElse(null);
                if (restaurant != null) {
                    restaurant.setViewCount((restaurant.getViewCount() != null ? restaurant.getViewCount() : 0) + 1);
                    restaurantRepository.save(restaurant);
                }
                break;
        }
    }

    @Override
    public void incrementBookmarkCount(Long itemId, ItemType itemType) {
        switch (itemType) {
            case ATTRACTION:
                AttractionEntity attraction = attractionRepository.findById(itemId).orElse(null);
                if (attraction != null) {
                    attraction.setBookmarkCount((attraction.getBookmarkCount() != null ? attraction.getBookmarkCount() : 0) + 1);
                    attractionRepository.save(attraction);
                }
                break;
            case HOTEL:
                HotelEntity hotel = hotelRepository.findById(itemId).orElse(null);
                if (hotel != null) {
                    hotel.setBookmarkCount((hotel.getBookmarkCount() != null ? hotel.getBookmarkCount() : 0) + 1);
                    hotelRepository.save(hotel);
                }
                break;
            case RESTAURANT:
                RestaurantEntity restaurant = restaurantRepository.findById(itemId).orElse(null);
                if (restaurant != null) {
                    restaurant.setBookmarkCount((restaurant.getBookmarkCount() != null ? restaurant.getBookmarkCount() : 0) + 1);
                    restaurantRepository.save(restaurant);
                }
                break;
        }
    }

    @Override
    public void incrementBookingCount(Long itemId, ItemType itemType) {
        switch (itemType) {
            case ATTRACTION:
                AttractionEntity attraction = attractionRepository.findById(itemId).orElse(null);
                if (attraction != null) {
                    attraction.setBookingCount((attraction.getBookingCount() != null ? attraction.getBookingCount() : 0) + 1);
                    attractionRepository.save(attraction);
                }
                break;
            case HOTEL:
                HotelEntity hotel = hotelRepository.findById(itemId).orElse(null);
                if (hotel != null) {
                    hotel.setBookingCount((hotel.getBookingCount() != null ? hotel.getBookingCount() : 0) + 1);
                    hotelRepository.save(hotel);
                }
                break;
            case RESTAURANT:
                RestaurantEntity restaurant = restaurantRepository.findById(itemId).orElse(null);
                if (restaurant != null) {
                    restaurant.setBookingCount((restaurant.getBookingCount() != null ? restaurant.getBookingCount() : 0) + 1);
                    restaurantRepository.save(restaurant);
                }
                break;
        }
    }

    @Override
    public void updateTrendingScore() {
        // Update trending scores based on recent activity (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);

        // Get all attractions and recalculate trending score
        List<AttractionEntity> attractions = attractionRepository.findAll();
        for (AttractionEntity attraction : attractions) {
            double trendingScore = calculateTrendingScore(
                    attraction.getViewCount(),
                    attraction.getBookingCount(),
                    attraction.getBookmarkCount(),
                    attraction.getRating()
            );
            attraction.setTrendingScore(trendingScore);
            attractionRepository.save(attraction);
        }

        // Same for hotels
        List<HotelEntity> hotels = hotelRepository.findAll();
        for (HotelEntity hotel : hotels) {
            double trendingScore = calculateTrendingScore(
                    hotel.getViewCount(),
                    hotel.getBookingCount(),
                    hotel.getBookmarkCount(),
                    hotel.getRating()
            );
            hotel.setTrendingScore(trendingScore);
            hotelRepository.save(hotel);
        }

        // Same for restaurants
        List<RestaurantEntity> restaurants = restaurantRepository.findAll();
        for (RestaurantEntity restaurant : restaurants) {
            double trendingScore = calculateTrendingScore(
                    restaurant.getViewCount(),
                    restaurant.getBookingCount(),
                    restaurant.getBookmarkCount(),
                    restaurant.getRating()
            );
            restaurant.setTrendingScore(trendingScore);
            restaurantRepository.save(restaurant);
        }

        log.info("Updated trending scores for all items");
    }

    private double calculateTrendingScore(Integer viewCount, Integer bookingCount, Integer bookmarkCount, Double rating) {
        double baseScore = 0.0;

        // Views: 40%
        baseScore += Math.min((viewCount != null ? viewCount : 0) / 100.0, 40.0) * 0.4;

        // Bookings: 35%
        baseScore += Math.min((bookingCount != null ? bookingCount : 0) / 50.0, 35.0) * 0.35;

        // Bookmarks: 15%
        baseScore += Math.min((bookmarkCount != null ? bookmarkCount : 0) / 30.0, 15.0) * 0.15;

        // Rating: 10%
        baseScore += (rating != null ? rating / 5.0 : 0.5) * 10.0 * 0.1;

        return Math.min(baseScore, 100.0);
    }
}
