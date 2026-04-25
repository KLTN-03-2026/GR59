package com.java.kltn.models.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO implements Serializable {

    private Long id;

    @NotBlank(message = "Tiêu đề bài viết không được để trống")
    private String title;

    private String excerpt;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String content;

    private String image;

    @NotBlank(message = "Chuyên mục không được để trống")
    private String category;

    private String readTime;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private String authorName = "Admin";

    private Integer viewCount;

    @Builder.Default
    private String status = "PUBLISHED";

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
