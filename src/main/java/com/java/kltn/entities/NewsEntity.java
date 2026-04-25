package com.java.kltn.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "news")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsEntity extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "image_url")
    private String image;

    @Column(length = 100)
    private String category;

    @Column(name = "read_time", length = 50)
    private String readTime;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "author_name", length = 100)
    @Builder.Default
    private String authorName = "Admin";

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(length = 50)
    @Builder.Default
    private String status = "PUBLISHED";
}
