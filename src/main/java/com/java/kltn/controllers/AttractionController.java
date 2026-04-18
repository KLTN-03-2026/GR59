package com.java.kltn.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.dto.AttractionDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.AttractionService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/attractions")
@CrossOrigin(origins = "*")
public class AttractionController {

    private final LocalizationUtils localizationUtils;
    private final AttractionService attractionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> getAllAttractions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.getAllAttractions(pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<AttractionDTO>> response = ApiResponse.success(message, attractions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttractionDTO>> getAttractionById(@PathVariable Long id) {
        AttractionDTO attraction = attractionService.getAttractionById(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_SUCCESS);
        ApiResponse<AttractionDTO> response = ApiResponse.success(message, attraction);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttractionDTO>> createAttraction(@RequestBody AttractionDTO request) {
        AttractionDTO attraction = attractionService.createAttraction(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_CREATE_SUCCESS);
        ApiResponse<AttractionDTO> response = ApiResponse.success(message, 201, attraction);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttractionDTO>> updateAttraction(
            @PathVariable Long id,
            @RequestBody AttractionDTO request) {
        AttractionDTO attraction = attractionService.updateAttraction(id, request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_UPDATE_SUCCESS);
        ApiResponse<AttractionDTO> response = ApiResponse.success(message, attraction);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttraction(@PathVariable Long id) {
        attractionService.deleteAttraction(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_DELETE_SUCCESS);
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }

    // Search APIs
    // Search by name
    @GetMapping("/search/by-name")
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> searchByName(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.searchByName(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm địa điểm theo tên", attractions));
    }

    // Search by location
    @GetMapping("/search/by-location")
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> searchByLocation(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.searchByLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm địa điểm theo địa điểm", attractions));
    }

    // Search by name or location
    @GetMapping("/search/by-keyword")
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> searchByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.searchByNameOrLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm địa điểm theo tên hoặc địa điểm", attractions));
    }

    // Search by name in province
    @GetMapping("/search/province/{provinceId}/by-name")
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> searchByNameInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.searchByNameAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm địa điểm theo tên trong tỉnh", attractions));
    }

    // Search by location in province
    @GetMapping("/search/province/{provinceId}/by-location")
    public ResponseEntity<ApiResponse<Page<AttractionDTO>>> searchByLocationInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttractionDTO> attractions = attractionService.searchByLocationAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm địa điểm theo địa điểm trong tỉnh", attractions));
    }
}
