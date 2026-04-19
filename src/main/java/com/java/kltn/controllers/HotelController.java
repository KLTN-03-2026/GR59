package com.java.kltn.controllers;

import com.java.kltn.models.responses.HotelResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.dto.HotelDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.HotelService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    private final LocalizationUtils localizationUtils;
    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.getAllHotels(pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<HotelResponse>> response = ApiResponse.success(message, hotels);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(@PathVariable Long id) {
        HotelResponse hotel = hotelService.getHotelById(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_SUCCESS);
        ApiResponse<HotelResponse> response = ApiResponse.success(message, hotel);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
            @RequestPart("hotel") HotelResponse request, // Nhận JSON thông tin khách sạn
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile, // 1 ảnh chính
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles // List ảnh gallery
    ) {
        // Truyền cả DTO và các File vào Service
        HotelResponse hotel = hotelService.createHotel(request, imageFile, galleryFiles);

        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_CREATE_SUCCESS);
        ApiResponse<HotelResponse> response = ApiResponse.success(message, 201, hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id,
            @RequestPart(value = "hotel",  required = false) HotelResponse request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles
    ) {
        HotelResponse hotel = hotelService.updateHotel(id, request, imageFile, galleryFiles);

        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_UPDATE_SUCCESS);
        ApiResponse<HotelResponse> response = ApiResponse.success(message, 200, hotel);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_DELETE_SUCCESS);
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }

    // Search APIs
    // Search by name
    @GetMapping("/search/by-name")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> searchByName(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.searchByName(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách sạn theo tên", hotels));
    }

    // Search by location
    @GetMapping("/search/by-location")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> searchByLocation(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.searchByLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách sạn theo địa điểm", hotels));
    }

    // Search by name or location
    @GetMapping("/search/by-keyword")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> searchByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.searchByNameOrLocation(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách sạn theo tên hoặc địa điểm", hotels));
    }

    // Search by name in province
    @GetMapping("/search/province/{provinceId}/by-name")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> searchByNameInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.searchByNameAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách sạn theo tên trong tỉnh", hotels));
    }

    // Search by location in province
    @GetMapping("/search/province/{provinceId}/by-location")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> searchByLocationInProvince(
            @PathVariable Long provinceId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HotelResponse> hotels = hotelService.searchByLocationAndProvince(keyword, provinceId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm khách sạn theo địa điểm trong tỉnh", hotels));
    }}
