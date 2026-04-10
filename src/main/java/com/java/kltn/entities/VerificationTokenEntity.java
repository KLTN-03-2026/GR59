package com.java.kltn.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lưu chuỗi UUID (khoảng 36 ký tự)
    @Column(nullable = false, unique = true, length = 100)
    private String token;

    // Thời gian hết hạn của link
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    // Liên kết 1-1 với bảng users.
    // fetch = FetchType.EAGER để khi tìm thấy Token là nó lôi luôn thông tin User ra cho tiện xử lý.
    @OneToOne(targetEntity = UserEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;
}