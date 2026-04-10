package com.java.kltn.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "refresh_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Token JWT thường rất dài, nên set length = 1000 hoặc dùng columnDefinition = "TEXT"
    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    // Cờ đánh dấu Token này đã bị thu hồi (Logout) hay chưa
    @Column(nullable = false)
    private boolean revoked;

    // Liên kết với User nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}