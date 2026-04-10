package com.java.kltn.repositories;

import com.java.kltn.entities.TripItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripItemRepository extends JpaRepository<TripItemEntity, Long> {
}
