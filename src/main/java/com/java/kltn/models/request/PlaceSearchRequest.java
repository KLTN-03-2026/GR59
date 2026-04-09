package com.java.kltn.models.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho Place search với pagination
 * Tuân theo SOLID: Tất cả search params trong 1 object
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceSearchRequest {
    
    private String category;
    private String region;
    private String search;
    
    @Min(value = 0, message = "Skip không được âm")
    private Integer skip;
    
    @Min(value = 1, message = "Limit phải >= 1")
    @Max(value = 100, message = "Limit không được > 100")
    private Integer limit;
    
    private String sortBy;
}
