package com.java.kltn.services.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.java.kltn.entities.UserEntity;
import com.java.kltn.exceptions.InvalidParamException;
import com.java.kltn.models.request.ChangePasswordRequest;
import com.java.kltn.models.responses.UserResponse;
import com.java.kltn.repositories.RoleRepository;
import com.java.kltn.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService  {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;



    @Transactional
    public UserResponse updateProfile(UserEntity user, UserResponse request) {
        // Check VIP expiration trước khi update
//        checkAndUpdateVipExpiration(user);

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        // Email không cho phép thay đổi qua profile update
        // if (request.getEmail() != null) {
        //     user.setEmail(request.getEmail());
        // }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        } else if (request.getPhone() == null && user.getPhone() != null) {
            // Cho phép xóa phone nếu gửi null
            user.setPhone(null);
        }

        // Birthday - luôn update nếu có trong request (kể cả null để xóa)
        user.setAddress(request.getAddress());

        // Lưu user sau khi update
        userRepository.save(user);

        // Note: avatar update should be handled separately via upload endpoint

        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(UserEntity user) {
        // Tự động check VIP expiration trước khi trả về response
        // Đảm bảo luôn lấy giá trị isVip mới nhất từ database
//        boolean wasUpdated = checkAndUpdateVipExpiration(user);

        // Nếu đã update, reload user từ DB để đảm bảo có data mới nhất
//        if (wasUpdated) {
//            user = userRepository.findById(user.getId()).orElse(user);
//        }

        // Đảm bảo isVip chỉ là true nếu thực sự là VIP và chưa hết hạn
//        boolean isActuallyVip = user.getIsVip() != null
//                && user.getIsVip()
//                && user.getVipExpiredAt() != null
//                && user.getVipExpiredAt().isAfter(LocalDateTime.now());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .phone(user.getPhone())
//                .isGoogleLinked(user.getIsGoogleLinked() != null ? user.getIsGoogleLinked() : false)
//                .googleEmail(user.getGoogleEmail())
                .build();
    }

    /**
     * Hủy liên kết tài khoản Google
     * @param user UserEntity cần hủy liên kết
     * @return UserResponse sau khi hủy liên kết
     */
//    @Transactional
//    public UserResponse unlinkGoogleAccount(UserEntity user) {
//        if (user.getIsGoogleLinked() == null || !user.getIsGoogleLinked()) {
//            throw new InvalidParamException("Tài khoản của bạn chưa liên kết với Google");
//        }
//
//        user.setIsGoogleLinked(false);
//        user.setGoogleEmail(null);
//        userRepository.save(user);
//
//        return mapToUserResponse(user);
//    }

    /**
     * Đổi mật khẩu của user
     * @param user UserEntity cần đổi mật khẩu
     * @param request ChangePasswordRequest chứa oldPassword, newPassword, confirmPassword
     * @throws IllegalArgumentException nếu mật khẩu cũ không đúng hoặc mật khẩu mới không khớp
     */
    @Transactional
    public void changePassword(UserEntity user, ChangePasswordRequest request) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new InvalidParamException("Mật khẩu cũ không đúng");
            }
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidParamException("Mật khẩu mới và xác nhận mật khẩu không khớp");
        }

        // Kiểm tra mật khẩu mới có khác mật khẩu cũ không
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                throw new InvalidParamException("Mật khẩu mới phải khác mật khẩu cũ");
            }
        }

        // Mã hóa mật khẩu mới và lưu vào database
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Lấy danh sách tất cả users (admin only)
     * @param search Từ khóa tìm kiếm (name hoặc email)
     * @param roleName Lọc theo role (ADMIN, STAFF, USER)
     * @return Danh sách UserResponse
     * Cache: 15 phút, cache key dựa trên search và roleName
     */
//    @Cacheable(value = "users", key = "'admin:users:all:' + (#search != null ? #search : '') + ':' + (#roleName != null ? #roleName : 'all')")
//    public List<UserResponse> getAllUsers(String search, String roleName) {
//        List<UserEntity> users;
//
//        // Normalize search và roleName
//        String normalizedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
//        String normalizedRole = (roleName != null && !roleName.trim().isEmpty()) ? roleName.trim() : null;
//
//        if (normalizedSearch != null && normalizedRole != null) {
//            // Search và filter theo role
//            users = userRepository.searchUsersByRole(normalizedSearch, normalizedRole);
//        } else if (normalizedSearch != null) {
//            // Chỉ search
//            users = userRepository.searchUsers(normalizedSearch);
//        } else if (normalizedRole != null) {
//            // Chỉ filter theo role
//            users = userRepository.findByRoleNameIgnoreCase(normalizedRole);
//        } else {
//            // Lấy tất cả
//            users = userRepository.findAll();
//        }
//
//        return users.stream()
//                .map(this::mapToUserResponse)
//                .collect(Collectors.toList());
//    }

//    /**
//     * Lấy user by ID
//     * @param userId ID của user
//     * @return UserResponse
//     * @throws DataNotFoundException nếu không tìm thấy user
//     */
//    public UserResponse getUserById(Long userId) throws DataNotFoundException {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với ID: " + userId));
//        return mapToUserResponse(user);
//    }
//
//    /**
//     * Admin tạo user mới (với password tạm thời)
//     * @param request CreateUserRequest chứa thông tin user
//     * @param currentUser User hiện tại đang tạo (để audit)
//     * @return UserResponse của user mới được tạo
//     * @throws ConflictException nếu email đã tồn tại
//     */
//    @Transactional
//    @CacheEvict(value = {"users", "statistics"}, allEntries = true)
//    public UserResponse createUser(CreateUserRequest request, UserEntity currentUser) {
//        // Kiểm tra email đã tồn tại chưa
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new ConflictException("Email đã được sử dụng: " + request.getEmail());
//        }
//
//        // Lấy role
//        String roleName = (request.getRole() != null && !request.getRole().trim().isEmpty())
//                ? request.getRole().trim().toUpperCase()
//                : "USER";
//
//        // Không cho phép tạo admin mới (chỉ có thể tạo USER hoặc STAFF)
//        if (roleName.equals("ADMIN")) {
//            throw new PermissionDenyException("Không thể tạo tài khoản ADMIN từ đây");
//        }
//
//        RoleEntity role = roleRepository.findByName(roleName)
//                .orElseThrow(() -> new DataNotFoundException("Role không hợp lệ: " + roleName));
//
//        // Generate password tạm thời ngẫu nhiên (8-12 ký tự)
//        String tempPassword = generateTempPassword();
//
//        // Tạo user mới - Admin tạo thì tự động active và verified
//        UserEntity newUser = UserEntity.builder()
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(tempPassword))
//                .name(request.getName())
//                .role(role)
//                .balance(request.getBalance() != null ? request.getBalance() : 0.0)
//                .isVip(request.getIsVip() != null ? request.getIsVip() : false)
//                .isEmailVerified(true) // Admin tạo user thì tự động verified - KHÔNG CẦN VERIFY EMAIL
//                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
//                .isGoogleLinked(false) // Admin tạo user thì chưa liên kết Google
//                .googleEmail(null) // Chưa có email Google
//                .build();
//
//        newUser = userRepository.save(newUser);
//
//        // CHỈ gửi email welcome với password tạm thời - KHÔNG gửi email verification
//        emailService.sendWelcomeEmail(
//                newUser.getEmail(),
//                newUser.getName(),
//                tempPassword
//        );
//
//        return mapToUserResponse(newUser);
//    }

    /**
     * Generate password tạm thời ngẫu nhiên (8-12 ký tự, có chữ hoa, chữ thường, số)
     */
    private String generateTempPassword() {
        String upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String allChars = upperCase + lowerCase + numbers;

        java.util.Random random = new java.util.Random();
        int length = 8 + random.nextInt(5); // 8-12 ký tự

        StringBuilder password = new StringBuilder();

        // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
        password.append(upperCase.charAt(random.nextInt(upperCase.length())));
        password.append(lowerCase.charAt(random.nextInt(lowerCase.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));

        // Thêm các ký tự ngẫu nhiên còn lại
        for (int i = password.length(); i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Xáo trộn các ký tự
        char[] passwordArray = password.toString().toCharArray();
        for (int i = passwordArray.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = passwordArray[i];
            passwordArray[i] = passwordArray[j];
            passwordArray[j] = temp;
        }

        return new String(passwordArray);
    }

//    /**
//     * Admin update user (có thể update role, balance, isActive, etc.)
//     * @param userId ID của user cần update
//     * @param request UserResponse chứa thông tin cần update
//     * @param currentUser User hiện tại đang thực hiện action (để check quyền)
//     * @return UserResponse đã được update
//     * @throws DataNotFoundException nếu không tìm thấy user
//     * @throws RuntimeException nếu không có quyền (ví dụ: xóa admin, xóa chính mình)
//     */
//    @Transactional
//    @CacheEvict(value = {"users", "statistics"}, allEntries = true)
//    public UserResponse updateUser(Long userId, UserResponse request, UserEntity currentUser) throws DataNotFoundException {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với ID: " + userId));
//
//        // Không cho phép update admin (trừ khi là chính admin đó update profile của mình)
//        if (user.getRole().getName().equalsIgnoreCase("ADMIN") && !user.getId().equals(currentUser.getId())) {
//            throw new PermissionDenyException("Không thể cập nhật thông tin của admin khác");
//        }
//
//        // Update name
//        if (request.getName() != null) {
//            user.setName(request.getName());
//        }
//
//        // Update phone
//        if (request.getPhone() != null) {
//            user.setPhone(request.getPhone());
//        } else if (request.getPhone() == null) {
//            user.setPhone(null);
//        }
//
//        // Update birthday
//        user.setBirthday(request.getBirthday());
//
//        // Update balance (admin only)
//        if (request.getBalance() != null) {
//            user.setBalance(request.getBalance());
//        }
//
//        // Update isActive (admin only)
//        if (request.getIsActive() != null) {
//            // Không cho phép ban admin
//            if (user.getRole().getName().equalsIgnoreCase("ADMIN") && !request.getIsActive()) {
//                throw new PermissionDenyException("Không thể khóa tài khoản admin");
//            }
//            user.setIsActive(request.getIsActive());
//        }
//
//        // Update role (admin only) - chỉ cho phép update USER và STAFF
//        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
//            // Không cho phép thay đổi role của admin
//            if (user.getRole().getName().equalsIgnoreCase("ADMIN")) {
//                throw new PermissionDenyException("Không thể thay đổi role của admin");
//            }
//            // Update role
//            String newRoleName = request.getRole().trim().toUpperCase();
//            RoleEntity newRole = roleRepository.findByName(newRoleName)
//                    .orElseThrow(() -> new DataNotFoundException("Role không hợp lệ: " + newRoleName));
//            user.setRole(newRole);
//        }
//
//        userRepository.save(user);
//        return mapToUserResponse(user);
//    }
//
//    /**
//     * Ban/Unban user
//     * @param userId ID của user
//     * @param currentUser User hiện tại đang thực hiện action
//     * @return UserResponse đã được update
//     * @throws DataNotFoundException nếu không tìm thấy user
//     * @throws RuntimeException nếu không có quyền
//     */
//    @Transactional
//    @CacheEvict(value = {"users", "statistics"}, allEntries = true)
//    public UserResponse banUser(Long userId, UserEntity currentUser) throws DataNotFoundException {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với ID: " + userId));
//
//        // Không cho phép ban admin
//        if (user.getRole().getName().equalsIgnoreCase("ADMIN")) {
//            throw new PermissionDenyException("Không thể khóa tài khoản admin");
//        }
//
//        // Không cho phép ban chính mình
//        if (user.getId().equals(currentUser.getId())) {
//            throw new PermissionDenyException("Không thể khóa chính mình");
//        }
//
//        // Toggle isActive
//        user.setIsActive(!user.getIsActive());
//        userRepository.save(user);
//
//        return mapToUserResponse(user);
//    }
//
//    /**
//     * Delete user (hard delete)
//     * @param userId ID của user
//     * @param currentUser User hiện tại đang thực hiện action
//     * @throws DataNotFoundException nếu không tìm thấy user
//     * @throws RuntimeException nếu không có quyền
//     */
//    @Transactional
//    @CacheEvict(value = {"users", "statistics"}, allEntries = true)
//    public void deleteUser(Long userId, UserEntity currentUser) throws DataNotFoundException {
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với ID: " + userId));
//
//        // Không cho phép xóa admin
//        if (user.getRole().getName().equalsIgnoreCase("ADMIN")) {
//            throw new PermissionDenyException("Không thể xóa tài khoản admin");
//        }
//
//        // Không cho phép xóa chính mình
//        if (user.getId().equals(currentUser.getId())) {
//            throw new PermissionDenyException("Không thể xóa chính mình");
//        }
//
//        // Hard delete
//        userRepository.delete(user);
//    }
//
//    public UserResponse getUserDetailsFromToken(String token) {
//        // Placeholder for future implementation (needs JwtService)
//        return null;
//    }

    // Public methods required by UserController
    
    public UserResponse getUserById(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidParamException("User not found with ID: " + userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserResponse request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidParamException("User not found with ID: " + userId));
        return updateProfile(user, request);
    }

    @Transactional
    public void deleteUserAccount(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidParamException("User not found with ID: " + userId));
        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidParamException("User not found with ID: " + userId));
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new InvalidParamException("Old password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Map<String, Object> getAllUsers(int skip, int limit, String search) {
        java.util.List<UserEntity> users;
        
        if (search != null &&! search.trim().isEmpty()) {
            // Search by email or name contains search term
            users = userRepository.findAll().stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(search.toLowerCase()) ||
                            (u.getFullName() != null && u.getFullName().toLowerCase().contains(search.toLowerCase())))
                    .skip(skip)
                    .limit(limit)
                    .collect(Collectors.toList());
        } else {
            // Get all users with pagination
            users = userRepository.findAll().stream()
                    .skip(skip)
                    .limit(limit)
                    .collect(Collectors.toList());
        }
        
        java.util.List<UserResponse> userResponses = users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("total", userRepository.count());
        result.put("users", userResponses);
        return result;
    }

    public String uploadAvatar(Long userId, MultipartFile file) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidParamException("User not found with ID: " + userId));
        
        try {
            // TODO: Upload to cloud storage (AWS S3, Cloudinary, etc.)
            // For now, return a placeholder URL
            String avatarUrl = "/uploads/avatars/" + userId + "_" + System.currentTimeMillis() + ".jpg";
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
            return avatarUrl;
        } catch (Exception e) {
            throw new InvalidParamException("Failed to upload avatar: " + e.getMessage());
        }
    }
}
