//package com.java.kltn.models.request;
//
//import jakarta.validation.constraints.Max;
//import jakarta.validation.constraints.Min;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.experimental.SuperBuilder;
//
///**
// * Base class cho pagination parameters
// * Tuân theo DRY principle - tái sử dụng cho tất cả query objects
// */
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@SuperBuilder
//public class PaginationRequest {
//
//    @Min(value = 0, message = "Skip không được âm")
//    private Integer skip;
//
//    @Min(value = 1, message = "Limit phải >= 1")
//    @Max(value = 100, message = "Limit không được > 100")
//    private Integer limit;
//}
