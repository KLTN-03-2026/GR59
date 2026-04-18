//package com.java.kltn.controllers;
//
//import com.java.kltn.components.LocalizationUtils;
//import com.java.kltn.models.responses.HotelResponse;
//import com.java.kltn.utils.MessageKeys;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import com.java.kltn.models.dto.HotelDTO;
//import com.java.kltn.models.responses.ApiResponse;
//import com.java.kltn.services.impl.HotelService;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/api/v1/admin/hotels")
//public class AdminHotelController {
//
//    private final LocalizationUtils localizationUtils;
//    private final HotelService hotelService;
//
////    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
//            @RequestPart("hotel") HotelResponse request, // Nhận JSON thông tin khách sạn
//            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile, // 1 ảnh chính
//            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles // List ảnh gallery
//    ) {
//        // Truyền cả DTO và các File vào Service
//        HotelResponse hotel = hotelService.createHotel(request, imageFile, galleryFiles);
//
//        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_CREATE_SUCCESS);
//        ApiResponse<HotelResponse> response = ApiResponse.success(message, 201, hotel);
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//    @PatchMapping("/{id}")
////    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
//            @PathVariable Long id,
//            @RequestBody HotelResponse request) {
//        HotelResponse hotel = hotelService.updateHotel(id, request);
//        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_UPDATE_SUCCESS);
//        ApiResponse<HotelResponse> response = ApiResponse.success(message, hotel);
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/{id}")
////    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
//        hotelService.deleteHotel(id);
//        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_DELETE_SUCCESS);
//        ApiResponse<Void> response = ApiResponse.success(message, null);
//        return ResponseEntity.ok(response);
//    }
//}