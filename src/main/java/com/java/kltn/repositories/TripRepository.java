package com.java.kltn.repositories;

import com.java.kltn.entities.TripEntity;
import com.java.kltn.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<TripEntity, Long> {
    List<TripEntity> findByUser(UserEntity user);
}
