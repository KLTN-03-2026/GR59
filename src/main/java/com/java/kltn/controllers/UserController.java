package com.java.kltn.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.request.ChangePasswordRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.models.responses.UserResponse;
import com.java.kltn.services.impl.UserService;
import com.java.kltn.utils.MessageKeys;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final LocalizationUtils localizationUtils;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable Long userId) {
        UserResponse user = userService.getUserById(userId);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        return ResponseEntity.ok(ApiResponse.success(message, user));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UserResponse request) {
        UserResponse updatedUser = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Updated successfully", updatedUser));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> deleteUserAccount(@PathVariable Long userId) {
        userService.deleteUserAccount(userId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", result));
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        Map<String, Boolean> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(ApiResponse.success("Updated successfully", result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsers(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        Map<String, Object> result = userService.getAllUsers(skip, limit, search);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    @PostMapping("/{userId}/avatar")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(userId, file);
        Map<String, String> result = new HashMap<>();
        result.put("avatarUrl", avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", result));
    }
}
