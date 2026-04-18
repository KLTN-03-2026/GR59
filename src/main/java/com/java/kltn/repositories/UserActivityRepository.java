package com.java.kltn.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.UserActivityEntity;
import com.java.kltn.enums.ActivityType;
import com.java.kltn.enums.ItemType;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivityEntity, Long> {

    List<UserActivityEntity> findByUserId(Long userId);

    @Query("SELECT ua FROM UserActivityEntity ua WHERE ua.user.id = :userId AND ua.itemType = :itemType")
    List<UserActivityEntity> findByUserIdAndItemType(@Param("userId") Long userId, @Param("itemType") ItemType itemType);

    @Query("SELECT ua FROM UserActivityEntity ua WHERE ua.user.id = :userId AND ua.itemId = :itemId")
    List<UserActivityEntity> findByUserIdAndItemId(@Param("userId") Long userId, @Param("itemId") Long itemId);

    @Query("SELECT ua FROM UserActivityEntity ua WHERE ua.actionType = :actionType AND ua.createdAt >= :since")
    List<UserActivityEntity> findRecentActivitiesByType(@Param("actionType") ActivityType actionType, @Param("since") LocalDateTime since);
}
