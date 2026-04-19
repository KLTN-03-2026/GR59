package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.java.kltn.enums.HotelType;
import com.java.kltn.enums.RestaurantCuisine;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
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
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ProvinceRepository provinceRepository;
    private final CloudinaryService cloudinaryService;

    public Page<RestaurantDTO> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable)
                .map(this::convertToDTO);
    }


    public RestaurantDTO getRestaurantById(Long id) {
        RestaurantEntity restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        return convertToDTO(restaurant);
    }
    // Hàm này giúp chỉ copy những trường có dữ liệu, trường nào null thì bỏ qua
    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for (java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        // Không bao giờ cho phép đè các trường ID và Ảnh từ DTO sang Entity bằng cách này
        emptyNames.add("id");
        emptyNames.add("provinceId");
        emptyNames.add("imageUrl");
        emptyNames.add("gallery");

        return emptyNames.toArray(new String[0]);
    }

    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO,
                                          MultipartFile imageFile,
                                          List<MultipartFile> galleryFiles) {
        RestaurantEntity restaurantEntity = new RestaurantEntity();

        // 1. Copy text (bỏ qua id, province, ảnh)
        BeanUtils.copyProperties(restaurantDTO, restaurantEntity, "id", "provinceId", "imageUrl", "gallery");

        // 2. Upload Ảnh chính
        if (imageFile != null && !imageFile.isEmpty()) {
            restaurantEntity.setImageUrl(cloudinaryService.uploadFile(imageFile));
        }

        // 3. Upload Gallery
        if (galleryFiles != null && !galleryFiles.isEmpty()) {
            List<String> urls = galleryFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .map(file -> cloudinaryService.uploadFile(file))
                    .collect(Collectors.toList());
            restaurantEntity.setGallery(urls);
        }

        // 4. Xử lý Category Enum
        if (restaurantDTO.getCategory() != null) {
            try {
                restaurantEntity.setCategory(RestaurantCuisine.valueOf(restaurantDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại nhà hàng không hợp lệ: " + restaurantDTO.getCategory());
            }
        }

        // 5. Xử lý Tỉnh thành
        if (restaurantDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(restaurantDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));
            restaurantEntity.setProvince(province);
        }

        return convertToDTO(restaurantRepository.save(restaurantEntity));
    }

    @Transactional
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO,
                                          MultipartFile imageFile,
                                          List<MultipartFile> galleryFiles) {
        RestaurantEntity existingRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // 1. Copy thông minh (chỉ những trường khác null)
        if (restaurantDTO != null) {
            BeanUtils.copyProperties(restaurantDTO, existingRestaurant, getNullPropertyNames(restaurantDTO));
        }

        // 2. Nếu có gửi ảnh chính mới thì cập nhật
        if (imageFile != null && !imageFile.isEmpty()) {
            existingRestaurant.setImageUrl(cloudinaryService.uploadFile(imageFile));
        }

        // 3. Nếu có gửi gallery mới thì thay thế
        if (galleryFiles != null && !galleryFiles.isEmpty()) {
            List<String> newUrls = galleryFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .map(file -> cloudinaryService.uploadFile(file))
                    .collect(Collectors.toList());
            existingRestaurant.setGallery(newUrls);
        }

        // 4. Update Category Enum (nếu có)
        if (restaurantDTO != null && restaurantDTO.getCategory() != null) {
            try {
                existingRestaurant.setCategory(RestaurantCuisine.valueOf(restaurantDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại nhà hàng không hợp lệ");
            }
        }

        // 5. Update Province (nếu có)
        if (restaurantDTO != null && restaurantDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(restaurantDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found"));
            existingRestaurant.setProvince(province);
        }

        return convertToDTO(restaurantRepository.save(existingRestaurant));
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
