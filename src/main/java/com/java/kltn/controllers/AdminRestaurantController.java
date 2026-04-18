package com.java.kltn.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.dto.RestaurantDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.RestaurantService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/restaurants")
public class AdminRestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody RestaurantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm nhà hàng thành công", restaurantService.createRestaurant(request)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RestaurantDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhà hàng thành công", restaurantService.updateRestaurant(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa nhà hàng", null));
    }
}