package com.java.kltn.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.entities.ReviewEntity;
import com.java.kltn.entities.UserActivityEntity;
import com.java.kltn.enums.ItemType;
import com.java.kltn.models.dto.RecommendationDTO;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.ProvinceRepository;
import com.java.kltn.repositories.RestaurantRepository;
import com.java.kltn.repositories.ReviewRepository;
import com.java.kltn.repositories.UserActivityRepository;
import com.java.kltn.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RecommendationService {

    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final HotelRepository hotelRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final UserActivityRepository userActivityRepository;
    private final ProvinceRepository provinceRepository;

//    public List<RecommendationDTO> getSmartRecommendations(Long userId, RecommendationRequest request) {
//        UserEntity user = userRepository.findById(userId).orElse(null);
//        if (user == null) {
//            return Collections.emptyList();
//        }
//
//        Integer limit = request.getLimit() != null ? request.getLimit() : 10;
//
//        // Get province by destination name
//        List<ProvinceEntity> provinces = provinceRepository.findAll()
//            .stream()
//            .filter(p -> p.getName().toLowerCase().contains(request.getDestination().toLowerCase()))
//            .collect(Collectors.toList());
//
//        if (provinces.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        Long provinceId = provinces.get(0).getId();
//        Double budgetLeft = request.getBudgetLeft() != null ? request.getBudgetLeft() : Double.MAX_VALUE;
//
//        // Get recommendations from different categories
//        List<RecommendationDTO> attractions = getAttractionRecommendations(userId, provinceId, budgetLeft, limit);
//        List<RecommendationDTO> hotels = getHotelRecommendations(userId, provinceId, budgetLeft, limit);
//        List<RecommendationDTO> restaurants = getRestaurantRecommendations(userId, provinceId, budgetLeft, limit);
//
//        // Combine and sort by confidence score
//        List<RecommendationDTO> allRecommendations = new ArrayList<>();
//        allRecommendations.addAll(attractions);
//        allRecommendations.addAll(hotels);
//        allRecommendations.addAll(restaurants);
//
//        return allRecommendations.stream()
//            .sorted((a, b) -> Double.compare(b.getConfidenceScore(), a.getConfidenceScore()))
//            .limit(limit)
//            .collect(Collectors.toList());
//    }

    public List<RecommendationDTO> getAttractionRecommendations(Long userId, Long provinceId, Double budgetLeft, Integer limit) {
        List<AttractionEntity> attractions = attractionRepository.findByProvinceId(provinceId);

        return attractions.stream()
                .map(attraction -> calculateAttractionScore(userId, attraction, budgetLeft))
                .filter(dto -> dto.getAveragePrice() <= budgetLeft)
                .sorted((a, b) -> Double.compare(b.getConfidenceScore(), a.getConfidenceScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

//    public List<RecommendationDTO> getHotelRecommendations(Long userId, Long provinceId, Double budgetLeft, Integer limit) {
//        List<HotelEntity> hotels = hotelRepository.findByProvinceId(provinceId);
//
//        return hotels.stream()
//            .map(hotel -> calculateHotelScore(userId, hotel, budgetLeft))
//            .filter(dto -> dto.getAveragePrice() <= budgetLeft)
//            .sorted((a, b) -> Double.compare(b.getConfidenceScore(), a.getConfidenceScore()))
//            .limit(limit)
//            .collect(Collectors.toList());
//    }
//
//    public List<RecommendationDTO> getRestaurantRecommendations(Long userId, Long provinceId, Double budgetLeft, Integer limit) {
//        List<RestaurantEntity> restaurants = restaurantRepository.findByProvinceId(provinceId);
//
//        return restaurants.stream()
//            .map(restaurant -> calculateRestaurantScore(userId, restaurant, budgetLeft))
//            .filter(dto -> dto.getAveragePrice() <= budgetLeft)
//            .sorted((a, b) -> Double.compare(b.getConfidenceScore(), a.getConfidenceScore()))
//            .limit(limit)
//            .collect(Collectors.toList());
//    }

    // ==================== Scoring Logic ====================

    private RecommendationDTO calculateAttractionScore(Long userId, AttractionEntity attraction, Double budgetLeft) {
        double personalizationScore = calculatePersonalizationScore(userId, attraction.getId(), ItemType.ATTRACTION);
        double collaborativeScore = calculateCollaborativeScore(userId, attraction.getId(), ItemType.ATTRACTION);
        double contentScore = calculateContentScore(attraction.getRating(), attraction.getReviewCount(), attraction.getAveragePrice(), budgetLeft);
        double contextScore = calculateContextScoreForAttraction(attraction);
        double realtimeScore = calculateRealTimeScore(attraction.getViewCount(), attraction.getBookingCount(), attraction.getTrendingScore());

        double finalScore =
                personalizationScore * 0.40 +
                        collaborativeScore * 0.20 +
                        contentScore * 0.15 +
                        contextScore * 0.15 +
                        realtimeScore * 0.10;

        return buildRecommendationDTO(attraction, finalScore, "Based on your preferences and similar users activity");
    }

//    private RecommendationDTO calculateHotelScore(Long userId, HotelEntity hotel, Double budgetLeft) {
//        double personalizationScore = calculatePersonalizationScore(userId, hotel.getId(), ItemType.HOTEL);
//        double collaborativeScore = calculateCollaborativeScore(userId, hotel.getId(), ItemType.HOTEL);
//        double contentScore = calculateContentScore(hotel.getRating(), hotel.getReviewCount(), hotel.getAveragePrice(), budgetLeft);
//        double contextScore = calculateContextScoreForHotel(hotel);
//        double realtimeScore = calculateRealTimeScore(hotel.getViewCount(), hotel.getBookingCount(), hotel.getTrendingScore());
//
//        double finalScore =
//            personalizationScore * 0.40 +
//            collaborativeScore * 0.20 +
//            contentScore * 0.15 +
//            contextScore * 0.15 +
//            realtimeScore * 0.10;
//
//        return buildRecommendationDTO(hotel, finalScore, "Top rated hotel matching your budget and style");
//    }
//
//    private RecommendationDTO calculateRestaurantScore(Long userId, RestaurantEntity restaurant, Double budgetLeft) {
//        double personalizationScore = calculatePersonalizationScore(userId, restaurant.getId(), ItemType.RESTAURANT);
//        double collaborativeScore = calculateCollaborativeScore(userId, restaurant.getId(), ItemType.RESTAURANT);
//        double contentScore = calculateContentScore(restaurant.getRating(), restaurant.getReviewCount(), restaurant.getAveragePrice(), budgetLeft);
//        double contextScore = calculateContextScoreForRestaurant(restaurant);
//        double realtimeScore = calculateRealTimeScore(restaurant.getViewCount(), restaurant.getBookingCount(), restaurant.getTrendingScore());
//
//        double finalScore =
//            personalizationScore * 0.40 +
//            collaborativeScore * 0.20 +
//            contentScore * 0.15 +
//            contextScore * 0.15 +
//            realtimeScore * 0.10;
//
//        return buildRecommendationDTO(restaurant, finalScore, "Popular restaurant with excellent ratings");
//    }

    // ==================== Score Calculation Methods ====================

    /**
     * Personalization Score (40%):
     * Based on user's history - attractions they viewed, bookmarked, rated
     */
    private double calculatePersonalizationScore(Long userId, Long itemId, ItemType itemType) {
        List<UserActivityEntity> userActivities = userActivityRepository.findByUserIdAndItemId(userId, itemId);

        double score = 0.0;
        if (!userActivities.isEmpty()) {
            // User has interacted with this item before
            score = 0.8;
        } else {
            // Check user's general interest pattern
            List<UserActivityEntity> allActivities = userActivityRepository.findByUserId(userId);
            if (!allActivities.isEmpty()) {
                // User is active, slight boost
                score = 0.3;
            }
        }

        return Math.min(score, 1.0);
    }

    /**
     * Collaborative Score (20%):
     * Based on what similar users (users with similar ratings/preferences) like
     */
    private double calculateCollaborativeScore(Long userId, Long itemId, ItemType itemType) {
        // Find similar users (users who rated items similarly to current user)
        List<ReviewEntity> userReviews = reviewRepository.findUserHighRatings(userId, 4);

        if (userReviews.isEmpty()) {
            return 0.2;
        }

        double similarUsersBoosted = 0.0;
        int count = 0;

        // For each highly-rated item by current user (limit to 5)
        int limit = Math.min(userReviews.size(), 5);
        for (int i = 0; i < limit; i++) {
            ReviewEntity review = userReviews.get(i);
            // Could be attraction, hotel or restaurant review
            switch (itemType) {
                case ATTRACTION:
                    if (review.getAttraction() != null) {
                        // Find users who rated this attraction
                        List<Long> similarUsers = reviewRepository.findUserIdsByAttractionRating(review.getAttraction().getId(), 4);
                        if (!similarUsers.isEmpty()) {
                            similarUsersBoosted += 0.2;
                            count++;
                        }
                    }
                    break;
                case HOTEL:
                    if (review.getHotel() != null) {
                        similarUsersBoosted += 0.2;
                        count++;
                    }
                    break;
                case RESTAURANT:
                    if (review.getRestaurant() != null) {
                        similarUsersBoosted += 0.2;
                        count++;
                    }
                    break;
            }
        }

        return count > 0 ? Math.min(similarUsersBoosted / count, 1.0) : 0.2;
    }

    /**
     * Content Score (15%):
     * Based on item's features: rating, reviews, price
     */
    private double calculateContentScore(Double rating, Integer reviewCount, Long price, Double budgetLeft) {
        double ratingScore = rating != null ? rating / 5.0 : 0.5;
        double reviewScore = Math.min((reviewCount != null ? reviewCount : 0) / 100.0, 1.0);
        double priceScore = price <= budgetLeft ? 1.0 : Math.max(0, 1.0 - (price - budgetLeft) / (budgetLeft * 0.5));

        return (ratingScore * 0.5 + reviewScore * 0.3 + priceScore * 0.2);
    }

    /**
     * Context Score - Attractions (15%):
     * Based on opening hours, best time to visit, duration
     */
    private double calculateContextScoreForAttraction(AttractionEntity attraction) {
        double score = 0.7; // base score

        if (attraction.getOpeningHours() != null && !attraction.getOpeningHours().isEmpty()) {
            score += 0.15;
        }
        if (attraction.getBestTimeToVisit() != null && !attraction.getBestTimeToVisit().isEmpty()) {
            score += 0.15;
        }

        return Math.min(score, 1.0);
    }

    /**
     * Context Score - Hotels (15%)
     */
    private double calculateContextScoreForHotel(HotelEntity hotel) {
        double score = 0.7;

        if (hotel.getOpeningHours() != null && !hotel.getOpeningHours().isEmpty()) {
            score += 0.15;
        }
        if (hotel.getDescription() != null && !hotel.getDescription().isEmpty()) {
            score += 0.15;
        }

        return Math.min(score, 1.0);
    }

    /**
     * Context Score - Restaurants (15%)
     */
    private double calculateContextScoreForRestaurant(RestaurantEntity restaurant) {
        double score = 0.7;

        if (restaurant.getOpeningHours() != null && !restaurant.getOpeningHours().isEmpty()) {
            score += 0.15;
        }
        if (restaurant.getDescription() != null && !restaurant.getDescription().isEmpty()) {
            score += 0.15;
        }

        return Math.min(score, 1.0);
    }

    /**
     * Real-time Score (10%):
     * Based on popularity metrics: views, bookings, trending score
     */
    private double calculateRealTimeScore(Integer viewCount, Integer bookingCount, Double trendingScore) {
        double viewScore = Math.min((viewCount != null ? viewCount : 0) / 1000.0, 1.0);
        double bookingScore = Math.min((bookingCount != null ? bookingCount : 0) / 500.0, 1.0);
        double trendingScoreNorm = (trendingScore != null ? trendingScore : 0) / 100.0;

        return (viewScore * 0.4 + bookingScore * 0.4 + trendingScoreNorm * 0.2);
    }

    // ==================== DTO Building ====================

    private RecommendationDTO buildRecommendationDTO(AttractionEntity attraction, double score, String reason) {
        return RecommendationDTO.builder()
                .id(attraction.getId())
                .name(attraction.getName())
                .type("ATTRACTION")
                .category(attraction.getCategory().toString())
                .rating(attraction.getRating())
                .reviewCount(attraction.getReviewCount())
                .averagePrice(attraction.getAveragePrice())
                .imageUrl(attraction.getImageUrl())
                .latitude(attraction.getLatitude())
                .longitude(attraction.getLongitude())
                .estimatedDuration(attraction.getEstimatedDuration())
                .reason(reason)
                .confidenceScore(score)
                .bookingCount(attraction.getBookingCount())
                .trendingScore(attraction.getTrendingScore())
                .build();
    }

//    private RecommendationDTO buildRecommendationDTO(HotelEntity hotel, double score, String reason) {
//        return RecommendationDTO.builder()
//            .id(hotel.getId())
//            .name(hotel.getName())
//            .type("HOTEL")
//            .category(hotel.getType().toString())
//            .rating(hotel.getRating())
//            .reviewCount(hotel.getReviewCount())
//            .averagePrice(hotel.getAveragePrice())
//            .imageUrl(hotel.getImageUrl())
//            .latitude(hotel.getLatitude())
//            .longitude(hotel.getLongitude())
//            .estimatedDuration(hotel.getEstimatedDuration())
//            .reason(reason)
//            .confidenceScore(score)
//            .bookingCount(hotel.getBookingCount())
//            .trendingScore(hotel.getTrendingScore())
//            .build();
//    }
//
//    private RecommendationDTO buildRecommendationDTO(RestaurantEntity restaurant, double score, String reason) {
//        return RecommendationDTO.builder()
//            .id(restaurant.getId())
//            .name(restaurant.getName())
//            .type("RESTAURANT")
//            .category(restaurant.getCuisine().toString())
//            .rating(restaurant.getRating())
//            .reviewCount(restaurant.getReviewCount())
//            .averagePrice(restaurant.getAveragePrice())
//            .imageUrl(restaurant.getImageUrl())
//            .latitude(restaurant.getLatitude())
//            .longitude(restaurant.getLongitude())
//            .estimatedDuration(restaurant.getEstimatedDuration())
//            .reason(reason)
//            .confidenceScore(score)
//            .bookingCount(restaurant.getBookingCount())
//            .trendingScore(restaurant.getTrendingScore())
//            .build();
//    }
}
