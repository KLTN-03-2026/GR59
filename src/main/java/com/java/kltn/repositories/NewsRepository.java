package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.NewsEntity;

@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Long> {

    Page<NewsEntity> findByStatus(String status, Pageable pageable);

    List<NewsEntity> findByCategory(String category);

    List<NewsEntity> findByCategoryAndStatus(String category, String status);

    Page<NewsEntity> findByCategoryAndStatus(String category, String status, Pageable pageable);

    Page<NewsEntity> findByIsFeaturedAndStatus(Boolean isFeatured, String status, Pageable pageable);

    @Query("SELECT n FROM NewsEntity n WHERE n.status = :status AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY n.createdAt DESC")
    Page<NewsEntity> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") String status, Pageable pageable);

    @Query("SELECT n FROM NewsEntity n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY n.createdAt DESC")
    Page<NewsEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT n FROM NewsEntity n WHERE n.status = :status ORDER BY n.isFeatured DESC, n.createdAt DESC")
    Page<NewsEntity> findAllByStatusOrderByFeaturedAndDate(@Param("status") String status, Pageable pageable);
}
