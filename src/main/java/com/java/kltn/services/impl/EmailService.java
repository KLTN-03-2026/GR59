package com.java.kltn.services.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Cache templates để không phải đọc file mỗi lần
    private final Map<String, String> templateCache = new ConcurrentHashMap<>();

    @Async
    public CompletableFuture<Void> sendVerificationEmail(String to, String token) {
        try {
            // Dùng MimeMessage để gửi được HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Xác thực tài khoản LocalGo"); // Thay tên app của bạn vào đây

            // Link xác thực ghép token
            String verificationUrl = "http://localhost:8888/api/v1/auth/verify-email?token=" + token;

            // Tạo giao diện HTML với nút bấm màu xanh lá cây
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto;\">"
                    + "<h2 style=\"color: #333;\">Chào mừng bạn!</h2>"
                    + "<p style=\"font-size: 16px; color: #555;\">Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn:</p>"
                    + "<div style=\"text-align: center; margin: 30px 0;\">"
                    + "  <a href=\"" + verificationUrl + "\" style=\"background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;\">Xác Thực Tài Khoản</a>"
                    + "</div>"
                    + "<p style=\"color: #888; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px;\">Nếu bạn không yêu cầu xác thực, vui lòng bỏ qua email này.</p>"
                    + "</div>";

            // Tham số 'true' báo cho Spring biết đây là nội dung HTML
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Đã gửi mail xác thực (HTML) tới: {}", to);
        } catch (Exception e) {
            log.error("Lỗi khi gửi mail xác thực tới {}: {}", to, e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    @Async
    public CompletableFuture<Void> sendOtpEmail(String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Mã OTP Đặt lại mật khẩu");

            // Nhét luôn giao diện HTML vào đây
            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 10px; background-color: #f9f9f9;\">"
                    + "<h2 style=\"color: #333; text-align: center; margin-top: 0;\">Yêu Cầu Đặt Lại Mật Khẩu</h2>"
                    + "<p style=\"font-size: 16px; color: #555;\">Hệ thống vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Mã xác thực (OTP) của bạn là:</p>"
                    + "<div style=\"background-color: #fff; padding: 15px; text-align: center; border-radius: 5px; border: 1px dashed #4CAF50; margin: 20px 0;\">"
                    + "   <h1 style=\"color: #4CAF50; letter-spacing: 8px; margin: 0; font-size: 36px;\">" + otp + "</h1>"
                    + "</div>"
                    + "<p style=\"font-size: 14px; color: #d9534f; text-align: center;\">⏳ Mã này chỉ có hiệu lực trong vòng <strong>5 phút</strong>.</p>"
                    + "<p style=\"font-size: 13px; color: #888; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;\">Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này. Tuyệt đối không chia sẻ mã OTP cho bất kỳ ai.</p>"
                    + "</div>";

            // true = Báo cho Spring biết đây là code HTML
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Đã gửi mã OTP (HTML) tới: {}", email);
        } catch (Exception e) {
            log.error("Lỗi khi gửi mã OTP tới {}: {}", email, e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }
}
