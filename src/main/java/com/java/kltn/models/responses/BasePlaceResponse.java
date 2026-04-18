package com.java.kltn.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BasePlaceResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private List<String> gallery; // Mảng danh sách ảnh như trong hình
    private String previewVideo;
    private String category;      // Trường chung để hứng giá trị Enum, khớp với JSON
    private String status;
    private Long averagePrice;
    private Integer estimatedDuration;
    private Long provinceId;      // Chỉ trả về ID, không trả Object
}
