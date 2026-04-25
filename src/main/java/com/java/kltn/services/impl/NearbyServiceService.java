package com.java.kltn.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.NearbyServiceEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.exceptions.DataNotFoundException;
import com.java.kltn.models.dto.NearbyServiceDTO;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.NearbyServiceRepository;
import com.java.kltn.repositories.RestaurantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NearbyServiceService {

    private final NearbyServiceRepository nearbyServiceRepository;
    private final AttractionRepository attractionRepository;
    private final HotelRepository hotelRepository;
    private final RestaurantRepository restaurantRepository;
    private final ModelMapper modelMapper;

    /**
     * Lấy tất cả dịch vụ lân cận của một địa điểm
     */
    public List<NearbyServiceDTO> getNearbyServicesByLocation(Long locationId) {
        AttractionEntity location = attractionRepository.findById(locationId)
                .orElseThrow(() -> new DataNotFoundException("Địa điểm không tồn tại"));

        List<NearbyServiceEntity> services = nearbyServiceRepository.findNearestServicesByAttraction(locationId);
        return services.stream()
                .map(service -> modelMapper.map(service, NearbyServiceDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Lấy dịch vụ lân cận theo loại
     */
    public List<NearbyServiceDTO> getNearbyServicesByLocationAndType(Long locationId, String serviceType) {
        AttractionEntity location = attractionRepository.findById(locationId)
                .orElseThrow(() -> new DataNotFoundException("Địa điểm không tồn tại"));

        List<NearbyServiceEntity> services = nearbyServiceRepository
                .findNearestServicesByAttractionAndType(locationId, serviceType);
        return services.stream()
                .map(service -> modelMapper.map(service, NearbyServiceDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Lấy dịch vụ lân cận theo loại (phân trang)
     */
    public Page<NearbyServiceDTO> getNearbyServicesByLocationAndTypePaginated(
            Long locationId, String serviceType, Pageable pageable) {
        AttractionEntity location = attractionRepository.findById(locationId)
                .orElseThrow(() -> new DataNotFoundException("Địa điểm không tồn tại"));

        Page<NearbyServiceEntity> services = nearbyServiceRepository.findByAttractionIdAndStatus(locationId, "ACTIVE", pageable);
        return services.map(service -> modelMapper.map(service, NearbyServiceDTO.class));
    }

    /**
     * Lấy tất cả dịch vụ lân cận của một khách sạn
     */
    public List<NearbyServiceDTO> getNearbyServicesByHotel(Long hotelId) {
        HotelEntity hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new DataNotFoundException("Khách sạn không tồn tại"));

        List<NearbyServiceEntity> services = nearbyServiceRepository.findNearestServicesByHotel(hotelId);
        return services.stream()
                .map(service -> modelMapper.map(service, NearbyServiceDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả dịch vụ lân cận của một nhà hàng
     */
    public List<NearbyServiceDTO> getNearbyServicesByRestaurant(Long restaurantId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new DataNotFoundException("Nhà hàng không tồn tại"));

        List<NearbyServiceEntity> services = nearbyServiceRepository.findNearestServicesByRestaurant(restaurantId);
        return services.stream()
                .map(service -> modelMapper.map(service, NearbyServiceDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Tạo dịch vụ lân cận mới (hỗ trợ Attraction, Hotel, hoặc Restaurant)
     */
    public NearbyServiceDTO createNearbyService(NearbyServiceDTO dto) {
        NearbyServiceEntity entity = modelMapper.map(dto, NearbyServiceEntity.class);
        entity.setStatus("ACTIVE");

        // Xử lý Attraction
        if (dto.getAttractionId() != null) {
            AttractionEntity attraction = attractionRepository.findById(dto.getAttractionId())
                    .orElseThrow(() -> new DataNotFoundException("Điểm du lịch không tồn tại"));
            entity.setAttraction(attraction);
        }

        // Xử lý Hotel
        if (dto.getHotelId() != null) {
            HotelEntity hotel = hotelRepository.findById(dto.getHotelId())
                    .orElseThrow(() -> new DataNotFoundException("Khách sạn không tồn tại"));
            entity.setHotel(hotel);
        }

        // Xử lý Restaurant
        if (dto.getRestaurantId() != null) {
            RestaurantEntity restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new DataNotFoundException("Nhà hàng không tồn tại"));
            entity.setRestaurant(restaurant);
        }

        NearbyServiceEntity saved = nearbyServiceRepository.save(entity);
        return modelMapper.map(saved, NearbyServiceDTO.class);
    }

    /**
     * Cập nhật dịch vụ lân cận
     */
    public NearbyServiceDTO updateNearbyService(Long id, NearbyServiceDTO dto) {
        NearbyServiceEntity entity = nearbyServiceRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Dịch vụ lân cận không tồn tại"));

        // Cập nhật Attraction
        if (dto.getAttractionId() != null) {
            if (entity.getAttraction() == null || !dto.getAttractionId().equals(entity.getAttraction().getId())) {
                AttractionEntity attraction = attractionRepository.findById(dto.getAttractionId())
                        .orElseThrow(() -> new DataNotFoundException("Điểm du lịch không tồn tại"));
                entity.setAttraction(attraction);
            }
        }

        // Cập nhật Hotel
        if (dto.getHotelId() != null) {
            if (entity.getHotel() == null || !dto.getHotelId().equals(entity.getHotel().getId())) {
                HotelEntity hotel = hotelRepository.findById(dto.getHotelId())
                        .orElseThrow(() -> new DataNotFoundException("Khách sạn không tồn tại"));
                entity.setHotel(hotel);
            }
        }

        // Cập nhật Restaurant
        if (dto.getRestaurantId() != null) {
            if (entity.getRestaurant() == null || !dto.getRestaurantId().equals(entity.getRestaurant().getId())) {
                RestaurantEntity restaurant = restaurantRepository.findById(dto.getRestaurantId())
                        .orElseThrow(() -> new DataNotFoundException("Nhà hàng không tồn tại"));
                entity.setRestaurant(restaurant);
            }
        }

        if (dto.getServiceType() != null) entity.setServiceType(dto.getServiceType());
        if (dto.getServiceName() != null) entity.setServiceName(dto.getServiceName());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getAddress() != null) entity.setAddress(dto.getAddress());
        if (dto.getLatitude() != null) entity.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) entity.setLongitude(dto.getLongitude());
        if (dto.getDistanceKm() != null) entity.setDistanceKm(dto.getDistanceKm());
        if (dto.getPhoneNumber() != null) entity.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getOpeningHours() != null) entity.setOpeningHours(dto.getOpeningHours());
        if (dto.getRating() != null) entity.setRating(dto.getRating());
        if (dto.getReviewCount() != null) entity.setReviewCount(dto.getReviewCount());
        if (dto.getImageUrl() != null) entity.setImageUrl(dto.getImageUrl());
        if (dto.getPriceLevel() != null) entity.setPriceLevel(dto.getPriceLevel());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());

        NearbyServiceEntity updated = nearbyServiceRepository.save(entity);
        return modelMapper.map(updated, NearbyServiceDTO.class);
    }

    /**
     * Xóa dịch vụ lân cận
     */
    public void deleteNearbyService(Long id) {
        NearbyServiceEntity entity = nearbyServiceRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Dịch vụ lân cận không tồn tại"));
        nearbyServiceRepository.delete(entity);
    }

    /**
     * Lấy chi tiết dịch vụ lân cận
     */
    public NearbyServiceDTO getNearbyServiceById(Long id) {
        NearbyServiceEntity entity = nearbyServiceRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Dịch vụ lân cận không tồn tại"));
        return modelMapper.map(entity, NearbyServiceDTO.class);
    }

    /**
     * Lấy tất cả dịch vụ theo loại
     */
    public List<NearbyServiceDTO> getNearbyServicesByType(String serviceType) {
        List<NearbyServiceEntity> services = nearbyServiceRepository.findByServiceType(serviceType);
        return services.stream()
                .map(service -> modelMapper.map(service, NearbyServiceDTO.class))
                .collect(Collectors.toList());
    }
}
