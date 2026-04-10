package com.java.kltn.models.responses;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response chuẩn cho tất cả API
 * Format: { EC, EM, DT }
 * EC: Error Code (0 = success, -1 = error)
 * EM: Error Message
 * DT: Data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private String message;
    private int status;
    private T data;

    public static <T> ApiResponse<T> success(T data){
        return ApiResponse.<T>builder()
                .message("Success")
                .status(200)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .message(message)
                .status(200)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, int status, T data) {
        return ApiResponse.<T>builder()
                .message(message)
                .status(status)
                .data(data)
                .build();
    }


    public static <T> ApiResponse<T> error(String message, int status) {
        return ApiResponse.<T>builder()
                .message(message)
                .status(status)
                .data(null)
                .build();
    }
}
