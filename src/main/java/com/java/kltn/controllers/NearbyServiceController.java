package com.java.kltn.controllers;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.dto.NearbyServiceDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.NearbyServiceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/nearby-services")
@CrossOrigin(origins = "*")
public class NearbyServiceController {

    private final NearbyServiceService nearbyServiceService;

    /**
     * Lấy tất cả dịch vụ lân cận của một điểm du lịch
     * GET /api/v1/nearby-services/attraction/{attractionId}
     */
    @GetMapping("/attraction/{attractionId}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByAttraction(
            @PathVariable Long attractionId) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByLocation(attractionId);
        String message = "Lấy danh sách dịch vụ lân cận điểm du lịch thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, services);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy dịch vụ lân cận theo loại của một điểm du lịch
     * GET /api/v1/nearby-services/attraction/{attractionId}/type/{serviceType}
     */
    @GetMapping("/attraction/{attractionId}/type/{serviceType}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByAttractionAndType(
            @PathVariable Long attractionId,
            @PathVariable String serviceType) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByLocationAndType(attractionId, serviceType);
        String message = "Lấy danh sách dịch vụ lân cận điểm du lịch theo loại thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, services);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả dịch vụ lân cận của một khách sạn
     * GET /api/v1/nearby-services/hotel/{hotelId}
     */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByHotel(
            @PathVariable Long hotelId) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByHotel(hotelId);
        String message = "Lấy danh sách dịch vụ lân cận khách sạn thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, services);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy dịch vụ lân cận theo loại của một khách sạn
     * GET /api/v1/nearby-services/hotel/{hotelId}/type/{serviceType}
     */
    @GetMapping("/hotel/{hotelId}/type/{serviceType}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByHotelAndType(
            @PathVariable Long hotelId,
            @PathVariable String serviceType) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByHotel(hotelId);
        List<NearbyServiceDTO> filteredServices = services.stream()
                .filter(s -> s.getServiceType().equalsIgnoreCase(serviceType))
                .toList();
        String message = "Lấy danh sách dịch vụ lân cận khách sạn theo loại thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, filteredServices);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả dịch vụ lân cận của một nhà hàng
     * GET /api/v1/nearby-services/restaurant/{restaurantId}
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByRestaurant(
            @PathVariable Long restaurantId) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByRestaurant(restaurantId);
        String message = "Lấy danh sách dịch vụ lân cận nhà hàng thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, services);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy dịch vụ lân cận theo loại của một nhà hàng
     * GET /api/v1/nearby-services/restaurant/{restaurantId}/type/{serviceType}
     */
    @GetMapping("/restaurant/{restaurantId}/type/{serviceType}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByRestaurantAndType(
            @PathVariable Long restaurantId,
            @PathVariable String serviceType) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByRestaurant(restaurantId);
        List<NearbyServiceDTO> filteredServices = services.stream()
                .filter(s -> s.getServiceType().equalsIgnoreCase(serviceType))
                .toList();
        String message = "Lấy danh sách dịch vụ lân cận nhà hàng theo loại thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, filteredServices);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết dịch vụ lân cận
     * GET /api/v1/nearby-services/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NearbyServiceDTO>> getNearbyServiceById(@PathVariable Long id) {
        NearbyServiceDTO service = nearbyServiceService.getNearbyServiceById(id);
        String message = "Lấy chi tiết dịch vụ lân cận thành công";
        ApiResponse<NearbyServiceDTO> response = ApiResponse.success(message, service);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tất cả dịch vụ theo loại
     * GET /api/v1/nearby-services/type/{serviceType}
     */
    @GetMapping("/type/{serviceType}")
    public ResponseEntity<ApiResponse<List<NearbyServiceDTO>>> getNearbyServicesByType(
            @PathVariable String serviceType) {
        List<NearbyServiceDTO> services = nearbyServiceService.getNearbyServicesByType(serviceType);
        String message = "Lấy danh sách dịch vụ theo loại thành công";
        ApiResponse<List<NearbyServiceDTO>> response = ApiResponse.success(message, services);
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo dịch vụ lân cận mới
     * POST /api/v1/nearby-services
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NearbyServiceDTO>> createNearbyService(
            @Valid @RequestBody NearbyServiceDTO dto) {
        NearbyServiceDTO created = nearbyServiceService.createNearbyService(dto);
        String message = "Tạo dịch vụ lân cận thành công";
        ApiResponse<NearbyServiceDTO> response = ApiResponse.success(message, created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật dịch vụ lân cận
     * PUT /api/v1/nearby-services/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NearbyServiceDTO>> updateNearbyService(
            @PathVariable Long id,
            @Valid @RequestBody NearbyServiceDTO dto) {
        NearbyServiceDTO updated = nearbyServiceService.updateNearbyService(id, dto);
        String message = "Cập nhật dịch vụ lân cận thành công";
        ApiResponse<NearbyServiceDTO> response = ApiResponse.success(message, updated);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa dịch vụ lân cận
     * DELETE /api/v1/nearby-services/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNearbyService(@PathVariable Long id) {
        nearbyServiceService.deleteNearbyService(id);
        String message = "Xóa dịch vụ lân cận thành công";
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }
}
