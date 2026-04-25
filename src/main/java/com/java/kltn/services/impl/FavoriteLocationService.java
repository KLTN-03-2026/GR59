package com.java.kltn.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.FavoriteLocationEntity;
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.dto.FavoriteLocationDTO;
import com.java.kltn.models.request.AddFavoriteLocationRequest;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.FavoriteLocationRepository;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.RestaurantRepository;
import com.java.kltn.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteLocationService {

    private final FavoriteLocationRepository favoriteLocationRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;
    private final HotelRepository hotelRepository;
    private final RestaurantRepository restaurantRepository;

    /**
     * Thêm địa điểm vào danh sách yêu thích
     */
    @Transactional
    public FavoriteLocationDTO addFavorite(Long userId, AddFavoriteLocationRequest request) {
        // Kiểm tra user tồn tại
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        FavoriteLocationEntity favorite = new FavoriteLocationEntity();
        favorite.setUser(user);
        favorite.setLocationType(request.getLocationType());

        // Kiểm tra xem địa điểm đã yêu thích chưa & lấy entity tương ứng
        switch (request.getLocationType()) {
            case "ATTRACTION" -> {
                AttractionEntity attraction = attractionRepository.findById(request.getLocationId())
                        .orElseThrow(() -> new RuntimeException("Điểm du lịch không tồn tại"));

                if (favoriteLocationRepository.existsByUserIdAndAttractionIdAndLocationType(
                        userId, request.getLocationId(), "ATTRACTION")) {
                    throw new RuntimeException("Địa điểm này đã được thêm vào danh sách yêu thích");
                }

                favorite.setAttraction(attraction);
            }
            case "HOTEL" -> {
                HotelEntity hotel = hotelRepository.findById(request.getLocationId())
                        .orElseThrow(() -> new RuntimeException("Khách sạn không tồn tại"));

                if (favoriteLocationRepository.existsByUserIdAndHotelIdAndLocationType(
                        userId, request.getLocationId(), "HOTEL")) {
                    throw new RuntimeException("Địa điểm này đã được thêm vào danh sách yêu thích");
                }

                favorite.setHotel(hotel);
            }
            case "RESTAURANT" -> {
                RestaurantEntity restaurant = restaurantRepository.findById(request.getLocationId())
                        .orElseThrow(() -> new RuntimeException("Nhà hàng không tồn tại"));

                if (favoriteLocationRepository.existsByUserIdAndRestaurantIdAndLocationType(
                        userId, request.getLocationId(), "RESTAURANT")) {
                    throw new RuntimeException("Địa điểm này đã được thêm vào danh sách yêu thích");
                }

                favorite.setRestaurant(restaurant);
            }
            default -> throw new RuntimeException("Loại địa điểm không hợp lệ");
        }

        FavoriteLocationEntity saved = favoriteLocationRepository.save(favorite);
        return convertToDTO(saved);
    }

    /**
     * Xóa địa điểm khỏi danh sách yêu thích
     */
    @Transactional
    public void removeFavorite(Long userId, Long locationId, String locationType) {
        switch (locationType) {
            case "ATTRACTION" ->
                    favoriteLocationRepository.deleteByUserIdAndAttractionIdAndLocationType(userId, locationId, "ATTRACTION");
            case "HOTEL" ->
                    favoriteLocationRepository.deleteByUserIdAndHotelIdAndLocationType(userId, locationId, "HOTEL");
            case "RESTAURANT" ->
                    favoriteLocationRepository.deleteByUserIdAndRestaurantIdAndLocationType(userId, locationId, "RESTAURANT");
            default -> throw new RuntimeException("Loại địa điểm không hợp lệ");
        }
    }

    /**
     * Lấy danh sách yêu thích của user (có phân trang)
     */
    public Page<FavoriteLocationDTO> getUserFavorites(Long userId, Pageable pageable) {
        return favoriteLocationRepository.findByUserId(userId, pageable)
                .map(this::convertToDTO);
    }

    /**
     * Lấy danh sách yêu thích của user (không phân trang)
     */
    public List<FavoriteLocationDTO> getUserFavoritesList(Long userId) {
        return favoriteLocationRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra user đã yêu thích địa điểm này chưa
     */
    public boolean isFavorite(Long userId, Long locationId, String locationType) {
        return switch (locationType) {
            case "ATTRACTION" -> favoriteLocationRepository.existsByUserIdAndAttractionIdAndLocationType(userId, locationId, "ATTRACTION");
            case "HOTEL" -> favoriteLocationRepository.existsByUserIdAndHotelIdAndLocationType(userId, locationId, "HOTEL");
            case "RESTAURANT" -> favoriteLocationRepository.existsByUserIdAndRestaurantIdAndLocationType(userId, locationId, "RESTAURANT");
            default -> false;
        };
    }

    /**
     * Đếm số lượng yêu thích của một địa điểm
     */
    public Long getFavoriteCount(Long locationId, String locationType) {
        return switch (locationType) {
            case "ATTRACTION" -> favoriteLocationRepository.countByAttractionIdAndLocationType(locationId, "ATTRACTION");
            case "HOTEL" -> favoriteLocationRepository.countByHotelIdAndLocationType(locationId, "HOTEL");
            case "RESTAURANT" -> favoriteLocationRepository.countByRestaurantIdAndLocationType(locationId, "RESTAURANT");
            default -> 0L;
        };
    }

    /**
     * Convert Entity sang DTO
     */
    private FavoriteLocationDTO convertToDTO(FavoriteLocationEntity entity) {
        String locationName;
        String imageUrl;
        Double rating;
        String address;

        // Lấy thông tin từ entity tương ứng
        if (entity.getAttraction() != null) {
            locationName = entity.getAttraction().getName();
            imageUrl = entity.getAttraction().getImageUrl();
            rating = entity.getAttraction().getRating();
            address = entity.getAttraction().getLocation();
        } else if (entity.getHotel() != null) {
            locationName = entity.getHotel().getName();
            imageUrl = entity.getHotel().getImageUrl();
            rating = entity.getHotel().getRating();
            address = entity.getHotel().getLocation();
        } else if (entity.getRestaurant() != null) {
            locationName = entity.getRestaurant().getName();
            imageUrl = entity.getRestaurant().getImageUrl();
            rating = entity.getRestaurant().getRating();
            address = entity.getRestaurant().getLocation();
        } else {
            throw new RuntimeException("Không tìm thấy dữ liệu địa điểm");
        }

        return FavoriteLocationDTO.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .locationId(entity.getAttraction() != null ? entity.getAttraction().getId() :
                        entity.getHotel() != null ? entity.getHotel().getId() :
                                entity.getRestaurant().getId())
                .locationType(entity.getLocationType())
                .locationName(locationName)
                .imageUrl(imageUrl)
                .rating(rating)
                .address(address)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
