package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.FileUploadService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadSingleImage(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> result = fileUploadService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/images")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files) {
        List<Map<String, Object>> results = fileUploadService.uploadImages(files);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PostMapping("/document")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String folder) {
        Map<String, Object> result = fileUploadService.uploadDocument(file, folder);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping("/{publicId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteFile(
            @PathVariable String publicId) {
        fileUploadService.deleteFile(publicId);
        Map<String, Boolean> result = new java.util.HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
