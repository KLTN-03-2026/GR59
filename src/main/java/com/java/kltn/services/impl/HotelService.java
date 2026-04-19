package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.java.kltn.enums.HotelType;
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
import com.java.kltn.entities.HotelEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.models.dto.HotelDTO;
import com.java.kltn.models.responses.HotelResponse;
import com.java.kltn.repositories.HotelRepository;
import com.java.kltn.repositories.ProvinceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final ProvinceRepository provinceRepository;
    private final CloudinaryService cloudinaryService;

    public Page<HotelResponse> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    public HotelResponse getHotelById(Long id) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
        return convertToResponse(hotel);
    }

    @Transactional
    public HotelResponse createHotel(HotelResponse hotelDTO,
                                     MultipartFile imageFile,
                                     List<MultipartFile> galleryFiles) {
        HotelEntity hotelEntity = new HotelEntity();

        // 1. Copy các trường text, bỏ qua id, provinceId và 2 trường ảnh (vì sẽ xử lý riêng)
        BeanUtils.copyProperties(hotelDTO, hotelEntity, "id", "provinceId", "imageUrl", "gallery");

        // 2. Xử lý Upload Ảnh chính (imageUrl)
        if (imageFile != null && !imageFile.isEmpty()) {
            String url = cloudinaryService.uploadFile(imageFile);
            hotelEntity.setImageUrl(url);
        }

        // 3. Xử lý Upload Gallery (nhiều ảnh)
        if (galleryFiles != null && !galleryFiles.isEmpty()) {
            List<String> galleryUrls = galleryFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .map(file -> cloudinaryService.uploadFile(file))
                    .collect(Collectors.toList());
            hotelEntity.setGallery(galleryUrls);
        }

        // 4. Xử lý Enum Category
        if (hotelDTO.getCategory() != null) {
            try {
                hotelEntity.setCategory(HotelType.valueOf(hotelDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + hotelDTO.getCategory());
            }
        }

        // 5. Xử lý Province
        if (hotelDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(hotelDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + hotelDTO.getProvinceId()));
            hotelEntity.setProvince(province);
        }

        HotelEntity savedHotel = hotelRepository.save(hotelEntity);
        return convertToResponse(savedHotel);
    }

    public static String[] getNullPropertyNames (Object source) {
        final BeanWrapper src = new BeanWrapperImpl(source);
        java.beans.PropertyDescriptor[] pds = src.getPropertyDescriptors();

        Set<String> emptyNames = new HashSet<>();
        for(java.beans.PropertyDescriptor pd : pds) {
            Object srcValue = src.getPropertyValue(pd.getName());
            if (srcValue == null) emptyNames.add(pd.getName());
        }
        // Thêm các trường ảnh vào danh sách ignore để không bị ghi đè link cũ
        emptyNames.add("id");
        emptyNames.add("imageUrl");
        emptyNames.add("gallery");
        emptyNames.add("provinceId");

        String[] result = new String[emptyNames.size()];
        return emptyNames.toArray(result);
    }

    @Transactional
    public HotelResponse updateHotel(Long id, HotelResponse hotelDTO,
                                     MultipartFile imageFile,
                                     List<MultipartFile> galleryFiles) {
        // 1. Tìm hotel cũ
        HotelEntity existingHotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));

        // 2. Copy các trường text, BỎ QUA các trường liên quan đến id và ảnh
        if (hotelDTO != null) {
            BeanUtils.copyProperties(hotelDTO, existingHotel, getNullPropertyNames(hotelDTO));
        }

        // 3. Xử lý Ảnh chính (imageUrl)
        if (imageFile != null && !imageFile.isEmpty()) {
            // Nếu có gửi file mới -> Upload và ghi đè link cũ
            String newUrl = cloudinaryService.uploadFile(imageFile);
            existingHotel.setImageUrl(newUrl);
        }
        // Nếu imageFile == null, Hibernate sẽ giữ nguyên giá trị cũ trong existingHotel.imageUrl

        // 4. Xử lý Gallery (nhiều ảnh)
        if (galleryFiles != null && !galleryFiles.isEmpty()) {
            // Lưu ý: Nếu gửi galleryFiles mới, thường là sẽ thay thế toàn bộ gallery cũ
            List<String> newGalleryUrls = galleryFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .map(file -> cloudinaryService.uploadFile(file))
                    .collect(Collectors.toList());

            existingHotel.setGallery(newGalleryUrls);
        }

        // 5. Xử lý Category (Enum)
        if (hotelDTO.getCategory() != null) {
            try {
                existingHotel.setCategory(HotelType.valueOf(hotelDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + hotelDTO.getCategory());
            }
        }

        // 6. Xử lý Province
        if (hotelDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(hotelDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + hotelDTO.getProvinceId()));
            existingHotel.setProvince(province);
        }

        HotelEntity updatedHotel = hotelRepository.save(existingHotel);
        return convertToResponse(updatedHotel);
    }


    @Transactional
    public void deleteHotel(Long id) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
        hotel.setStatus("MAINTENANCE");
        hotelRepository.save(hotel);
    }

    // Search APIs
    public Page<HotelResponse> searchByProvince(Long provinceId, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByProvinceIdAndStatus(provinceId, "ACTIVE");
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
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
    public HotelResponse mapToHotelResponse(HotelEntity entity) {
        return convertToResponse(entity);
    }

    private HotelResponse convertToResponse(HotelEntity entity) {
        HotelResponse response = new HotelResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setLocation(entity.getLocation());
        response.setRating(entity.getRating());
        response.setReviewCount(entity.getReviewCount());
        response.setImageUrl(entity.getImageUrl());
        response.setPreviewVideo(entity.getPreviewVideo());
        response.setStatus(entity.getStatus());
        response.setAveragePrice(entity.getAveragePrice());
        response.setEstimatedDuration(entity.getEstimatedDuration());
        response.setProvinceId(entity.getProvince() != null ? entity.getProvince().getId() : null);
        response.setCategory(entity.getCategory() != null ? entity.getCategory().name() : null);
        response.setGallery(entity.getGallery() != null ? new ArrayList<>(entity.getGallery()) : new ArrayList<>());
        return response;
    }

    // Search by name
    public Page<HotelResponse> searchByName(String keyword, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByNameContainingAndActive(keyword);
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location
    public Page<HotelResponse> searchByLocation(String keyword, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByLocationContainingAndActive(keyword);
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name or location
    public Page<HotelResponse> searchByNameOrLocation(String keyword, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByNameOrLocationContainingAndActive(keyword);
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name in province
    public Page<HotelResponse> searchByNameAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByNameContainingAndProvinceIdAndActive(keyword, provinceId);
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location in province
    public Page<HotelResponse> searchByLocationAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<HotelEntity> hotels = hotelRepository.findByLocationContainingAndProvinceIdAndActive(keyword, provinceId);
        List<HotelResponse> dtos = hotels.stream()
                .map(this::convertToResponse)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<HotelResponse> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }
}