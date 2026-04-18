package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.List;

import com.java.kltn.enums.HotelType;
import com.java.kltn.enums.RestaurantCuisine;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.entities.RestaurantEntity;
import com.java.kltn.models.dto.RestaurantDTO;
import com.java.kltn.models.responses.RestaurantResponse;
import com.java.kltn.repositories.ProvinceRepository;
import com.java.kltn.repositories.RestaurantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ProvinceRepository provinceRepository;


    public Page<RestaurantDTO> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable)
                .map(this::convertToDTO);
    }


    public RestaurantDTO getRestaurantById(Long id) {
        RestaurantEntity restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        return convertToDTO(restaurant);
    }

    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO) {
        RestaurantEntity restaurantEntity = new RestaurantEntity();
        BeanUtils.copyProperties(restaurantDTO, restaurantEntity, "id", "provinceId");

        if (restaurantDTO.getCategory() != null) {
            try {
                // Giả sử Enum của Thắng tên là HotelType
                restaurantEntity.setCategory(RestaurantCuisine.valueOf(restaurantDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + restaurantDTO.getCategory());
            }
        }

        if (restaurantDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(restaurantDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + restaurantDTO.getProvinceId()));
            restaurantEntity.setProvince(province);
        }

        RestaurantEntity savedRestaurant = restaurantRepository.save(restaurantEntity);
        return convertToDTO(savedRestaurant);
    }

    @Transactional
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO) {
        RestaurantEntity existingRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));

        BeanUtils.copyProperties(restaurantDTO, existingRestaurant, "id", "provinceId");

        if (restaurantDTO.getCategory() != null) {
            try {
                // Giả sử Enum của Thắng tên là HotelType
                existingRestaurant.setCategory(RestaurantCuisine.valueOf(restaurantDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + restaurantDTO.getCategory());
            }
        }

        if (restaurantDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(restaurantDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + restaurantDTO.getProvinceId()));
            existingRestaurant.setProvince(province);
        }

        RestaurantEntity updatedRestaurant = restaurantRepository.save(existingRestaurant);
        return convertToDTO(updatedRestaurant);
    }

    @Transactional
    public void deleteRestaurant(Long id) {
        RestaurantEntity restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        restaurant.setStatus("CLOSED");
        restaurantRepository.save(restaurant);
    }

    public Page<RestaurantDTO> searchByProvince(Long provinceId, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByProvinceIdAndStatus(provinceId, "OPENING");
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }



    private RestaurantDTO convertToDTO(RestaurantEntity entity) {
        RestaurantDTO dto = new RestaurantDTO();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getProvince() != null) {
            dto.setProvinceId(entity.getProvince().getId());
        }
        dto.setCategory(entity.getCategory() != null ? entity.getCategory().name() : null);
        dto.setGallery(entity.getGallery() != null ? new ArrayList<>(entity.getGallery()) : new ArrayList<>());
        return dto;
    }

    private List<String> parseGallery(String galleryJson) {
        if (galleryJson == null || galleryJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(galleryJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // Search by name
    public Page<RestaurantDTO> searchByName(String keyword, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByNameContainingAndActive(keyword);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location
    public Page<RestaurantDTO> searchByLocation(String keyword, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByLocationContainingAndActive(keyword);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name or location
    public Page<RestaurantDTO> searchByNameOrLocation(String keyword, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByNameOrLocationContainingAndActive(keyword);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name in province
    public Page<RestaurantDTO> searchByNameAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByNameContainingAndProvinceIdAndActive(keyword, provinceId);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location in province
    public Page<RestaurantDTO> searchByLocationAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByLocationContainingAndProvinceIdAndActive(keyword, provinceId);
        List<RestaurantDTO> dtos = restaurants.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<RestaurantDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }
}
