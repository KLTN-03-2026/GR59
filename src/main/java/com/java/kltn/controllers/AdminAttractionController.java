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

import com.java.kltn.models.dto.AttractionDTO;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.AttractionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/attractions")
@RequiredArgsConstructor
public class AdminAttractionController {

    private final AttractionService attractionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttractionDTO>> create(@RequestBody AttractionDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm địa điểm thành công", attractionService.createAttraction(request)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttractionDTO>> update(@PathVariable Long id, @RequestBody AttractionDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", attractionService.updateAttraction(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        attractionService.deleteAttraction(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa địa điểm", null));
    }
}