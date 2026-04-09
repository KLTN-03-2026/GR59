package com.java.kltn.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
//    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<UserEntity> findByGoogleId(String googleId);
    Optional<UserEntity> findByFacebookId(String facebookId);
    // Spring Data JPA sẽ tự động tạo câu SQL: SELECT * FROM users WHERE email LIKE %search% OR full_name LIKE %search% LIMIT ... OFFSET ...
    Page<UserEntity> findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
            String email, String fullName, Pageable pageable);
}
