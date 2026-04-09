package com.java.kltn.controllers;


import java.util.Map;

import com.google.api.client.auth.oauth2.RefreshTokenRequest;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.request.*;
import com.java.kltn.services.impl.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.java.kltn.components.LocalizationUtils;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.models.responses.AuthResponse;
import com.java.kltn.services.impl.AuthService;
import com.java.kltn.utils.MessageKeys;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final LocalizationUtils localizationUtils;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request){
        AuthResponse authData = authService.register(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.REGISTER_SUCCESS);
        ApiResponse<AuthResponse> response = ApiResponse.success(message, authData);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        AuthResponse authData = authService.login(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.LOGIN_SUCCESS);
        ApiResponse<AuthResponse> response = ApiResponse.success(message, authData);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(RefreshTokenRequest request){
        authService.logout(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.LOGOUT_SUCCESS);
        ApiResponse<Void> response = ApiResponse.success(message, null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest request){
        AuthResponse refreshToken = authService.refreshToken(request);
        ApiResponse<AuthResponse> responseApiResponse = ApiResponse.success(refreshToken);
        return ResponseEntity.ok(responseApiResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleAuthRequest request) {
        AuthResponse authData = authService.googleLogin(request.getToken());
        String message = localizationUtils.getLocalizedMessage(MessageKeys.GOOGLE_LOGIN_SUCCESS);
        ApiResponse<AuthResponse> response = ApiResponse.success(message, authData);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/facebook")
    public ResponseEntity<ApiResponse<AuthResponse>> facebookLogin(@Valid @RequestBody FacebookAuthRequest request) {
        AuthResponse authData = authService.facebookLogin(request.getAccessToken());
        String message = localizationUtils.getLocalizedMessage(MessageKeys.FACEBOOK_LOGIN_SUCCESS);
        ApiResponse<AuthResponse> response = ApiResponse.success(message, authData);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-verification-email")
    public ResponseEntity<ApiResponse<String>> sendVerificationEmail() {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            authService.sendVerificationEmail(userEmail);
            ApiResponse<String> response = ApiResponse.success(
                    "Đã gửi link xác thực. Vui lòng kiểm tra hộp thư email!",
                    null
            );
            return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        try {
            // Đẩy xuống Service để check Token và đổi cờ isEmailVerified = true
            authService.verifyEmailToken(token);

            // Vì user mở từ Gmail, nên trả về một giao diện HTML nhỏ gọn báo thành công
            String htmlSuccess = "<!DOCTYPE html><html lang=\"vi\"><head><meta charset=\"UTF-8\"><title>Xác thực thành công</title></head><body style=\"text-align:center; padding:50px; font-family:Arial, sans-serif;\"><h2 style=\"color:#4CAF50;\">Xác thực tài khoản thành công! ✅</h2><p>Bạn có thể đóng tab này và quay lại ứng dụng để tiếp tục.</p></body></html>";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "text/html; charset=UTF-8")
                    .body(htmlSuccess);

        } catch (Exception e) {
            // Báo lỗi bằng HTML nếu link hết hạn hoặc sai
            String htmlError = "<!DOCTYPE html><html lang=\"vi\"><head><meta charset=\"UTF-8\"><title>Lỗi xác thực</title></head><body style=\"text-align:center; padding:50px; font-family:Arial, sans-serif;\"><h2 style=\"color:#f44336;\">Xác thực thất bại ❌</h2><p>" + e.getMessage() + "</p></body></html>";
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CONTENT_TYPE, "text/html; charset=UTF-8")
                    .body(htmlError);
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOTP(@Valid @RequestBody SendOtpRequest request){
        Map<String, Object> result = authService.sendOtpEmail(request);
        String message = localizationUtils.getLocalizedMessage(MessageKeys.SUCCESS);
        ApiResponse<Map<String, Object>> response = ApiResponse.success(message, result);
        return ResponseEntity.ok(response);
    }

     //Kiểm tra OTP có hợp lệ không (chỉ check, chưa reset pass)
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isValid = authService.verifyOtp(request.getEmail(), request.getOtp());
            ApiResponse<Boolean> response = ApiResponse.success("Mã OTP hợp lệ", true);
            return ResponseEntity.ok(response);
    }

    //Đặt lại mật khẩu mới
    @PostMapping("/reset-password-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtpAndResetPassword(
            @Valid @RequestBody ResetPasswordOtpRequest request) {

        Map<String, Object> data = authService.verifyOtpAndResetPassword(
                request.getEmail(),
                request.getNewPassword()
        );
        String message = localizationUtils.getLocalizedMessage(MessageKeys.PASSWORD_RESET_SUCCESS);
        ApiResponse<Map<String, Object>> response = ApiResponse.success(message, data);

        return ResponseEntity.ok(response);
    }

}
