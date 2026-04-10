package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.*;

import com.google.api.client.auth.oauth2.RefreshTokenRequest;
import com.java.kltn.entities.RefreshTokenEntity;
import com.java.kltn.entities.VerificationTokenEntity;
import com.java.kltn.repositories.RefreshTokenRepository;
import com.java.kltn.repositories.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.java.kltn.entities.RoleEntity;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.exceptions.ConflictException;
import com.java.kltn.exceptions.DataNotFoundException;
import com.java.kltn.exceptions.InvalidParamException;
import com.java.kltn.models.dto.FacebookUserInfo;
import com.java.kltn.models.request.LoginRequest;
import com.java.kltn.models.request.RegisterRequest;
import com.java.kltn.models.request.SendOtpRequest;
import com.java.kltn.models.request.VerifyOtpRequest;
import com.java.kltn.models.responses.AuthResponse;
import com.java.kltn.models.responses.UserResponse;
import com.java.kltn.repositories.RoleRepository;
import com.java.kltn.repositories.UserRepository;
import com.java.kltn.services.IAuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    //    private final RestTemplate restTemplate = new RestTemplate();
    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final RestTemplate restTemplate;
    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    @Value("${google.oauth.client-secret:}")
    private String googleClientSecret;

    @Value("${google.oauth.redirect-uri:http://localhost:5173/auth/google/callback}")
    private String googleRedirectUri;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email đã được sử dụng");
        }

        RoleEntity userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new DataNotFoundException("Role USER không tồn tại"));

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(userRole)
                .isActive(true)
                .isEmailVerified(false)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Transactional
    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserEntity user = (UserEntity) authentication.getPrincipal();

        if (!user.getIsActive()) {
            throw new InvalidParamException("Tài khoản của bạn đã bị khóa");
        }

        String token = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        refreshTokenRepository.revokeAllUserTokens(user.getId());

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                .token(refreshToken)
                .user(user)
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Transactional
    public void sendVerificationEmail(String userEmail) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        if (user.getIsEmailVerified()) {
            throw new IllegalStateException("Tài khoản này đã được xác thực rồi!");
        }

        verificationTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        VerificationTokenEntity verificationToken = VerificationTokenEntity.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24)) // Hạn 24 tiếng
                .build();
        verificationTokenRepository.save(verificationToken);

        String verifyLink = "http://localhost:8888/api/v1/auth/verify-email?token=" + token;
        String emailContent = "<p>Chào bạn,</p>"
                + "<p>Vui lòng bấm vào đường dẫn bên dưới để xác thực email của bạn:</p>"
                + "<a href=\"" + verifyLink + "\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;\">Xác Thực Email</a>";

        emailService.sendVerificationEmail(userEmail, token);
    }

    @Transactional
    public void verifyEmailToken(String token) {

        VerificationTokenEntity verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Đường dẫn xác thực không hợp lệ hoặc không tồn tại!"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new RuntimeException("Đường dẫn đã hết hạn. Vui lòng yêu cầu gửi lại email!");
        }

        UserEntity user = verificationToken.getUser();
        user.setIsEmailVerified(true);

        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
    }

    @Transactional
    public AuthResponse googleLogin(String credentialToken) {
        try {
            // 1. Khởi tạo "máy quét" Token chính chủ của Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Xác minh cái token mà React vừa gửi lên
            GoogleIdToken idToken = verifier.verify(credentialToken);
            if (idToken == null) {
                throw new InvalidParamException("Token Google không hợp lệ hoặc đã hết hạn.");
            }

            // 3. Giải mã lấy thông tin User ngay tại chỗ (Không cần gọi thêm API sang Google)
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();

            // 4. XỬ LÝ LOGIC DATABASE (Tái sử dụng logic xuất sắc của bạn)
            Optional<UserEntity> userByGoogleId = userRepository.findByGoogleId(googleId); // Nhớ tạo hàm này trong Repository nhé
            UserEntity user;

            if (userByGoogleId.isPresent()) {
                // KỊCH BẢN 1: Đã từng đăng nhập Google rồi -> Cứ thế mà vào
                user = userByGoogleId.get();

                // Tính năng xịn: Nếu họ đổi email trên Google, hệ thống mình tự cập nhật theo luôn
                if (!user.getEmail().equals(email)) {
                    user.setEmail(email);
                    userRepository.save(user);
                }

            } else {
                // Tầng 2: Không tìm thấy googleId. Quét xem email này đã đăng ký thường (bằng mật khẩu) bao giờ chưa?
                Optional<UserEntity> userByEmail = userRepository.findByEmail(email);

                if (userByEmail.isPresent()) {
                    // KỊCH BẢN 2: Thấy email cũ -> Gộp tài khoản (Merge Account)
                    user = userByEmail.get();
                    linkGoogleAccount(user, googleId);
                } else {
                    // KỊCH BẢN 3: Không tìm thấy cả GoogleId lẫn Email -> Người dùng hoàn toàn mới
                    user = createGoogleUser(email, name, pictureUrl, googleId);
                }
            }

// Chốt chặn an ninh: Kiểm tra xem tài khoản (dù cũ hay mới) có đang bị Admin khóa không
            if (user.getIsActive() != null && !user.getIsActive()) {
                throw new InvalidParamException("Tài khoản của bạn đã bị khóa.");
            }


            // 5. Cấp 2 cái thẻ quen thuộc của KLTN_Travel
            String token = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return AuthResponse.builder()
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (InvalidParamException e) {
            throw e; // Trả đúng lỗi do mình tự định nghĩa ra Controller
        } catch (Exception e) {
            throw new RuntimeException("Xác thực Google OAuth thất bại: " + e.getMessage());
        }
    }

    @Transactional
    protected UserEntity createGoogleUser(String email, String name, String pictureUrl, String gooogleId) {
        RoleEntity userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new DataNotFoundException("Role USER không tồn tại"));

        UserEntity user = UserEntity.builder()
                .email(email)
                // Sinh bừa một cái mật khẩu mã hóa vì user Google không dùng mật khẩu này
                .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                .fullName(name != null ? name : email.split("@")[0])
                .avatarUrl(pictureUrl)
                .role(userRole) // Nhớ mở comment trường này ra nhé để phân quyền
                .isEmailVerified(false) // Google đã xác thực thì mình tin luôn
                .isActive(true)
                .isGoogleLinked(true)
                .googleId(gooogleId)
                .facebookId("0")
                .build();

        return userRepository.save(user);
    }

    private void linkGoogleAccount(UserEntity user, String googleId) {
        // Nếu tài khoản cũ chưa link với Google, thì bây giờ link lại
        if (user.getIsGoogleLinked() == null || !user.getIsGoogleLinked()) {
            user.setIsGoogleLinked(true);
            user.setGoogleId(googleId);
            userRepository.save(user); // Lưu cập nhật xuống Database
        }
    }

    @Transactional
    public AuthResponse facebookLogin(String fbAccessToken) {
        try {
            String graphApiUrl = "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=" + fbAccessToken;
            RestTemplate restTemplate = new RestTemplate();

            // SỬ DỤNG FacebookUserInfo Ở ĐÂY
            FacebookUserInfo fbUser = restTemplate.getForObject(graphApiUrl, FacebookUserInfo.class);
            if (fbUser == null || fbUser.getId() == null) {
                throw new InvalidParamException("Token Facebook không hợp lệ!");
            }


            String facebookId = fbUser.getId();
            String name = fbUser.getName();
            String email = fbUser.getEmail(); // Có thể null
            String avatarUrl = (fbUser.getPicture() != null && fbUser.getPicture().getData() != null)
                    ? fbUser.getPicture().getData().getUrl() : null;

            // 2. XỬ LÝ LOGIC DATABASE (Luồng 3 tầng)
            Optional<UserEntity> userByFbId = userRepository.findByFacebookId(facebookId);
            UserEntity user;

            if (userByFbId.isPresent()) {
                // TẦNG 1: Đã từng đăng nhập Facebook rồi
                user = userByFbId.get();

                // Cập nhật lại email nếu có thay đổi (và email mới không bị null)
                if (email != null && !email.equals(user.getEmail())) {
                    user.setEmail(email);
                    userRepository.save(user);
                }
            } else {
                // TẦNG 2: Check xem email này đã đăng ký thường/Google bao giờ chưa?
                // Chú ý: Phải check email != null vì có người dùng sđt lập Facebook
                Optional<UserEntity> userByEmail = (email != null)
                        ? userRepository.findByEmail(email)
                        : Optional.empty();

                if (userByEmail.isPresent()) {
                    // Có email cũ -> Gộp tài khoản (Merge Account)
                    user = userByEmail.get();
                    linkFacebookAccount(user, facebookId);
                } else {
                    // TẦNG 3: Hoàn toàn mới -> Tạo tài khoản
                    // Xử lý vụ Facebook không có email (sinh ra một cái email ảo để lưu DB cho khỏi lỗi nullable)
                    String savedEmail = (email != null) ? email : facebookId + "@facebook.com";
                    user = createFacebookUser(savedEmail, name, avatarUrl, facebookId);
                }
            }

            // Kiểm tra khóa tài khoản
            if (user.getIsActive() != null && !user.getIsActive()) {
                throw new InvalidParamException("Tài khoản của bạn đã bị khóa.");
            }

            // 3. Cấp Token hệ thống
            String token = jwtService.generateAccessToken(user); // Lưu ý tên hàm generate token của bạn
            String refreshToken = jwtService.generateRefreshToken(user);

            return AuthResponse.builder()
                    .accessToken(token) // Hoặc .token(token) tùy cấu trúc AuthResponse của bạn
                    .refreshToken(refreshToken)
                    .user(mapToUserResponse(user))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Xác thực Facebook OAuth thất bại: " + e.getMessage());
        }
    }

    @Transactional
    protected UserEntity createFacebookUser(String email, String name, String avatarUrl, String facebookId) {
        RoleEntity userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new DataNotFoundException("Role USER không tồn tại"));

        UserEntity user = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                .fullName(name != null ? name : "User_" + facebookId)
                .avatarUrl(avatarUrl)
                .role(userRole)
                .isActive(true)
                .isFacebookLinked(true) // Đánh dấu đã link FB
                .facebookId(facebookId)
                .googleId("0") // Set tạm giá trị mặc định tránh lỗi
                .build();

        return userRepository.save(user);
    }

    private void linkFacebookAccount(UserEntity user, String facebookId) {
        if (user.getIsFacebookLinked() == null || !user.getIsFacebookLinked()) {
            user.setIsFacebookLinked(true);
            user.setFacebookId(facebookId);
            userRepository.save(user);
        }
    }

    public void logout(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        // Tìm token trong DB
        RefreshTokenEntity storedToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không tồn tại"));

        // 👉 ĐÁNH DẤU LÀ ĐÃ THU HỒI
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request){

        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        if(userEmail != null){
            UserEntity user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new DataNotFoundException("email not exist"));

            RefreshTokenEntity storedToken = refreshTokenRepository.findByToken(refreshToken)
                    .orElseThrow(() -> new RuntimeException("Token không tồn tại trong hệ thống"));

            if (storedToken.isRevoked()) {
                throw new RuntimeException("Token này đã bị thu hồi (User đã đăng xuất). Vui lòng đăng nhập lại!");
            }
            if(jwtService.validateToken(refreshToken,user)){
                String accessToken = jwtService.generateAccessToken(user);
                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        throw new RuntimeException("Refresh token is invalid or expired");
    }

    public Map<String, Object> sendOtpEmail(SendOtpRequest request) {
        String email = request.getEmail();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("Tài khoản không tồn tại!"));

        String otp = otpService.generateOtp();
        otpService.saveOtp(email, otp);

        // 👉 CHỈ CẦN GỌI ĐÚNG 1 DÒNG NÀY NHƯ CŨ
        emailService.sendOtpEmail(email, otp);

        Map<String, Object> result = new HashMap<>();
        result.put("email", email);
        result.put("status", "OTP_SENT");
        result.put("expiresIn", 300);

        return result;
    }

    public boolean verifyOtp(String email, String otp) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng với email này"));

        boolean isOptValid = otpService.verifyOtp(email, otp);
         if(!isOptValid) {
             throw new RuntimeException("Mã OTP không chính xác hoặc đã hết hạn");
         }
         return true;
    }

    @Transactional
    public Map<String, Object> verifyOtpAndResetPassword(String email, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        // 2. CHỈ KIỂM TRA CỜ XÁC THỰC (Vì OTP đã check ở API trước rồi)
        // Hàm isOtpVerified sẽ check trong ConcurrentHashMap xem email này đã verify chưa
        if (!otpService.isOtpVerified(email)) {
            throw new RuntimeException("Phiên xác thực đã hết hạn hoặc bạn chưa nhập OTP. Vui lòng thử lại!");
        }

        // Nếu đã lọt qua được cửa ải trên -> Tiến hành đổi mật khẩu
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Dọn dẹp tàn dư: Xóa sạch thông tin OTP của user này trong RAM để giải phóng bộ nhớ
        otpService.removeOtp(email);

        // Trả về data (bạn có thể trả về thông tin gì tùy thích, FE nhận được Map này)
        Map<String, Object> result = new HashMap<>();
        result.put("email", user.getEmail());
        result.put("status", "PASSWORD_CHANGED_SUCCESSFULLY");
        return result;
    }

    private UserResponse mapToUserResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .address(user.getAddress())
                .createdAt(user.getCreatedAt())
                .phone(user.getPhone())
                .googleId(user.getGoogleId())
                .facebookId(user.getFacebookId())
                .isGoogleLinked(user.getIsGoogleLinked() != null ? user.getIsGoogleLinked() : false)
                .isFacebookLinked(user.getFacebookId() != null ? user.getIsFacebookLinked() : false)
                .isEmailVerified(user.getIsEmailVerified())
                .build();
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

}

