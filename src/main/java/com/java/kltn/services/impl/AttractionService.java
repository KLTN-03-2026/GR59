package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.List;

import com.java.kltn.enums.AttractionCategory;
import com.java.kltn.enums.RestaurantCuisine;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.entities.AttractionEntity;
import com.java.kltn.entities.ProvinceEntity;
import com.java.kltn.models.dto.AttractionDTO;
import com.java.kltn.models.responses.AttractionResponse;
import com.java.kltn.repositories.AttractionRepository;
import com.java.kltn.repositories.ProvinceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private final AttractionRepository attractionRepository;
    private final ProvinceRepository provinceRepository;

    public Page<AttractionDTO> getAllAttractions(Pageable pageable) {
        return attractionRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public AttractionDTO getAttractionById(Long id) {
        AttractionEntity attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found with id: " + id));
        return convertToDTO(attraction);
    }

    @Transactional
    public AttractionDTO createAttraction(AttractionDTO attractionDTO) {
        AttractionEntity attractionEntity = new AttractionEntity();
        BeanUtils.copyProperties(attractionDTO, attractionEntity, "id", "provinceId");

        if (attractionDTO.getCategory() != null) {
            try {
                // Giả sử Enum của Thắng tên là HotelType
                attractionEntity.setCategory(AttractionCategory.valueOf(attractionDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + attractionDTO.getCategory());
            }
        }

        if (attractionDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(attractionDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + attractionDTO.getProvinceId()));
            attractionEntity.setProvince(province);
        }

        AttractionEntity savedAttraction = attractionRepository.save(attractionEntity);
        return convertToDTO(savedAttraction);
    }

    @Transactional
    public AttractionDTO updateAttraction(Long id, AttractionDTO attractionDTO) {
        AttractionEntity existingAttraction = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found with id: " + id));

        BeanUtils.copyProperties(attractionDTO, existingAttraction, "id", "provinceId");

        if (attractionDTO.getCategory() != null) {
            try {
                // Giả sử Enum của Thắng tên là HotelType
                existingAttraction.setCategory(AttractionCategory.valueOf(attractionDTO.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Loại khách sạn không hợp lệ: " + attractionDTO.getCategory());
            }
        }

        if (attractionDTO.getProvinceId() != null) {
            ProvinceEntity province = provinceRepository.findById(attractionDTO.getProvinceId())
                    .orElseThrow(() -> new RuntimeException("Province not found with id: " + attractionDTO.getProvinceId()));
            existingAttraction.setProvince(province);
        }

        AttractionEntity updatedAttraction = attractionRepository.save(existingAttraction);
        return convertToDTO(updatedAttraction);
    }

    @Transactional
    public void deleteAttraction(Long id) {
        AttractionEntity attraction = attractionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attraction not found with id: " + id));
        attraction.setStatus("INACTIVE");
        attractionRepository.save(attraction);
    }

    public Page<AttractionDTO> searchByProvince(Long provinceId, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByProvinceIdAndStatus(provinceId, "ACTIVE");
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }



    private AttractionDTO convertToDTO(AttractionEntity entity) {
        AttractionDTO dto = new AttractionDTO();
        BeanUtils.copyProperties(entity, dto);
        dto.setProvinceId(entity.getProvince() != null ? entity.getProvince().getId() : null);
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
    public Page<AttractionDTO> searchByName(String keyword, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByNameContainingAndActive(keyword);
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location
    public Page<AttractionDTO> searchByLocation(String keyword, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByLocationContainingAndActive(keyword);
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name or location
    public Page<AttractionDTO> searchByNameOrLocation(String keyword, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByNameOrLocationContainingAndActive(keyword);
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by name in province
    public Page<AttractionDTO> searchByNameAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByNameContainingAndProvinceIdAndActive(keyword, provinceId);
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }

    // Search by location in province
    public Page<AttractionDTO> searchByLocationAndProvince(String keyword, Long provinceId, Pageable pageable) {
        List<AttractionEntity> attractions = attractionRepository.findByLocationContainingAndProvinceIdAndActive(keyword, provinceId);
        List<AttractionDTO> dtos = attractions.stream()
                .map(this::convertToDTO)
                .toList();
        int total = dtos.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<AttractionDTO> pageContent = dtos.subList(start, end);
        return new PageImpl<>(pageContent, pageable, total);
    }
}
