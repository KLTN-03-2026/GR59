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
import com.java.kltn.models.dto.UserDTO;
import com.java.kltn.models.request.CreateUserRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.AdminUserService;
import com.java.kltn.utils.MessageKeys;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final LocalizationUtils localizationUtils;

    /**
     * Lấy tất cả người dùng
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = adminUserService.getAllUsers(pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<UserDTO>> response = ApiResponse.success(message, users);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết một người dùng
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = adminUserService.getUserById(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_SUCCESS);
        ApiResponse<UserDTO> response = ApiResponse.success(message, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Tìm kiếm người dùng theo tên hoặc email
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = adminUserService.searchByNameOrEmail(keyword, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<UserDTO>> response = ApiResponse.success(message, users);
        return ResponseEntity.ok(response);
    }

    /**
     * Lọc người dùng theo vai trò
     */
    @GetMapping("/filter/role/{roleId}")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> filterByRole(
            @PathVariable Long roleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = adminUserService.filterByRole(roleId, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<UserDTO>> response = ApiResponse.success(message, users);
        return ResponseEntity.ok(response);
    }

    /**
     * Lọc người dùng theo trạng thái (active/inactive)
     */
    @GetMapping("/filter/status")
    public ResponseEntity<ApiResponse<Page<UserDTO>>> filterByStatus(
            @RequestParam Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = adminUserService.filterByStatus(isActive, pageable);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_GET_ALL_SUCCESS);
        ApiResponse<Page<UserDTO>> response = ApiResponse.success(message, users);
        return ResponseEntity.ok(response);
    }

    /**
     * Tạo người dùng mới
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@RequestBody CreateUserRequest request) {
        UserDTO user = adminUserService.createUser(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_CREATE_SUCCESS);
        ApiResponse<UserDTO> response = ApiResponse.success(message, 201, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        UserDTO user = adminUserService.updateUser(id, request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_UPDATE_SUCCESS);
        ApiResponse<UserDTO> response = ApiResponse.success(message, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Khóa người dùng (soft delete - set isActive = false)
     */
    @PutMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<UserDTO>> lockUser(@PathVariable Long id) {
        UserDTO user = adminUserService.lockUser(id);
        String message = "Khóa người dùng thành công";
        ApiResponse<UserDTO> response = ApiResponse.success(message, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Mở khóa người dùng (set isActive = true)
     */
    @PutMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<UserDTO>> unlockUser(@PathVariable Long id) {
        UserDTO user = adminUserService.unlockUser(id);
        String message = "Mở khóa người dùng thành công";
        ApiResponse<UserDTO> response = ApiResponse.success(message, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa vĩnh viễn người dùng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.CATEGORY_DELETE_SUCCESS);
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }
}
