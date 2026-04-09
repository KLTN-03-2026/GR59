//package com.java.kltn.models.request;
//
//import jakarta.validation.constraints.Min;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
///**
// * DTO cho filter Itinerary theo giá
// * Tuân theo SOLID: Tất cả price-related params trong 1 object
// */
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ItineraryPriceFilterRequest extends PaginationRequest {
//
//    @Min(value = 0, message = "Giá min không được âm")
//    private Double minPrice;
//
//    @Min(value = 0, message = "Giá max không được âm")
//    private Double maxPrice;
//}
