//package com.java.kltn.services.impl;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.java.kltn.entities.RoleEntity;
//import com.java.kltn.entities.UserEntity;
//import com.java.kltn.models.dto.UserDTO;
//import com.java.kltn.models.request.CreateUserRequest;
//import com.java.kltn.models.request.UpdateUserRequest;
//import com.java.kltn.repositories.RoleRepository;
//import com.java.kltn.repositories.UserRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class AdminUserService {
//
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    /**
//     * Lấy tất cả người dùng (có phân trang)
//     */
//    public Page<UserDTO> getAllUsers(Pageable pageable) {
//        return userRepository.findAll(pageable)
//                .map(this::convertToDTO);
//    }
//
//    /**
//     * Lấy chi tiết một người dùng theo ID
//     */
//    public UserDTO getUserById(Long id) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        return convertToDTO(user);
//    }
//
//    /**
//     * Tìm kiếm người dùng theo tên hoặc email
//     */
//    public Page<UserDTO> searchByNameOrEmail(String keyword, Pageable pageable) {
//        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable)
//                .map(this::convertToDTO);
//    }
//
//    /**
//     * Lọc người dùng theo vai trò (role)
//     */
//    public Page<UserDTO> filterByRole(Long roleId, Pageable pageable) {
//        return userRepository.findByRoleId(roleId, pageable)
//                .map(this::convertToDTO);
//    }
//
//    /**
//     * Lọc người dùng theo trạng thái (active/inactive)
//     */
//    public Page<UserDTO> filterByStatus(Boolean isActive, Pageable pageable) {
//        return userRepository.findByIsActive(isActive, pageable)
//                .map(this::convertToDTO);
//    }
//
//    /**
//     * Tạo người dùng mới
//     */
//    @Transactional
//    public UserDTO createUser(CreateUserRequest request) {
//        // Kiểm tra email đã tồn tại chưa
//        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already exists: " + request.getEmail());
//        }
//
//        UserEntity user = UserEntity.builder()
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .fullName(request.getFullName())
//                .address(request.getAddress())
//                .phone(request.getPhone())
//                .bio(request.getBio())
//                .isEmailVerified(request.getIsEmailVerified() != null ? request.getIsEmailVerified() : false)
//                .isActive(true)
//                .build();
//
//        // Set role
//        if (request.getRoleId() != null) {
//            RoleEntity role = roleRepository.findById(request.getRoleId())
//                    .orElseThrow(() -> new RuntimeException("Role not found"));
//            user.setRole(role);
//        }
//
//        UserEntity savedUser = userRepository.save(user);
//        return convertToDTO(savedUser);
//    }
//
//    /**
//     * Cập nhật thông tin người dùng
//     */
//    @Transactional
//    public UserDTO updateUser(Long id, UpdateUserRequest request) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//
//        // Cập nhật các trường được cấp
//        if (request.getFullName() != null && !request.getFullName().isBlank()) {
//            user.setFullName(request.getFullName());
//        }
//        if (request.getEmail() != null && !request.getEmail().isBlank()) {
//            // Kiểm tra email mới không trùng với user khác
//            if (!user.getEmail().equals(request.getEmail())
//                    && userRepository.findByEmail(request.getEmail()).isPresent()) {
//                throw new RuntimeException("Email already exists: " + request.getEmail());
//            }
//            user.setEmail(request.getEmail());
//        }
//        if (request.getPhone() != null && !request.getPhone().isBlank()) {
//            user.setPhone(request.getPhone());
//        }
//        if (request.getAddress() != null && !request.getAddress().isBlank()) {
//            user.setAddress(request.getAddress());
//        }
//        if (request.getBio() != null) {
//            user.setBio(request.getBio());
//        }
//        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
//            user.setAvatarUrl(request.getAvatarUrl());
//        }
//        if (request.getIsEmailVerified() != null) {
//            user.setIsEmailVerified(request.getIsEmailVerified());
//        }
//        if (request.getRoleId() != null) {
//            RoleEntity role = roleRepository.findById(request.getRoleId())
//                    .orElseThrow(() -> new RuntimeException("Role not found"));
//            user.setRole(role);
//        }
//
//        UserEntity updatedUser = userRepository.save(user);
//        return convertToDTO(updatedUser);
//    }
//
//    /**
//     * Xóa mềm (khóa) người dùng - set isActive = false
//     */
//    @Transactional
//    public UserDTO lockUser(Long id) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        user.setIsActive(false);
//        UserEntity lockedUser = userRepository.save(user);
//        return convertToDTO(lockedUser);
//    }
//
//    /**
//     * Mở khóa người dùng - set isActive = true
//     */
//    @Transactional
//    public UserDTO unlockUser(Long id) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        user.setIsActive(true);
//        UserEntity unlockedUser = userRepository.save(user);
//        return convertToDTO(unlockedUser);
//    }
//
//    /**
//     * Xóa vĩnh viễn người dùng
//     */
//    @Transactional
//    public void deleteUser(Long id) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//        userRepository.delete(user);
//    }
//
//    /**
//     * Convert UserEntity to UserDTO
//     */
//    private UserDTO convertToDTO(UserEntity user) {
//        return UserDTO.builder()
//                .id(user.getId())
//                .email(user.getEmail())
//                .fullName(user.getFullName())
//                .address(user.getAddress())
//                .phone(user.getPhone())
//                .avatarUrl(user.getAvatarUrl())
//                .bio(user.getBio())
//                .roleId(user.getRole() != null ? user.getRole().getId() : null)
//                .roleName(user.getRole() != null ? user.getRole().getName() : null)
//                .isActive(user.getIsActive())
//                .isEmailVerified(user.getIsEmailVerified())
//                .googleId(user.getGoogleId())
//                .facebookId(user.getFacebookId())
//                .isGoogleLinked(user.getIsGoogleLinked())
//                .isFacebookLinked(user.getIsFacebookLinked())
//                .createdAt(user.getCreatedAt())
//                .updatedAt(user.getUpdatedAt())
//                .build();
//    }
//}
//*/