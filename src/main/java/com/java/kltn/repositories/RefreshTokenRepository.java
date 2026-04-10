package com.java.kltn.repositories;

import com.java.kltn.entities.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    // Tìm Token trong DB
    Optional<RefreshTokenEntity> findByToken(String token);

    // Xóa/Thu hồi tất cả Token đang chạy của 1 User (Dùng khi đăng nhập máy mới)
    @Modifying
    @Query("UPDATE RefreshTokenEntity r SET r.revoked = true WHERE r.user.id = :userId AND r.revoked = false")
    void revokeAllUserTokens(Long userId);
}