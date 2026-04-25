package com.java.kltn.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * ReviewStatus enum cho phép Admin quản lý trạng thái của đánh giá
 * - ACTIVE: Đánh giá được hiển thị cho công chúng
 * - HIDDEN: Đánh giá bị ẩn (spam, xúc phạm, không phù hợp)
 * - PENDING: Đánh giá đang chờ kiểm duyệt
 */
public enum ReviewStatus {
    ACTIVE,      // Đánh giá được hiển thị
    HIDDEN,      // Đánh giá bị ẩn (chờ kiểm duyệt hoặc đã vi phạm quy tắc)
    PENDING;     // Đánh giá chờ kiểm duyệt

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ReviewStatus fromValue(String value) {
        if (value == null) {
            return ACTIVE;
        }
        try {
            return ReviewStatus.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid ReviewStatus: " + value + ". Valid values are: ACTIVE, HIDDEN, PENDING");
        }
    }
}
