package com.java.kltn.repositories;

import com.java.kltn.entities.UserEntity;
import com.java.kltn.entities.VerificationTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Long> {

    Optional<VerificationTokenEntity> findByToken(String token);
    void deleteByUser(UserEntity user);
}