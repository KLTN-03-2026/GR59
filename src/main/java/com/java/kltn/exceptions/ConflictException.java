package com.java.kltn.exceptions;

/**
 * Exception khi có conflict dữ liệu (ví dụ: email đã tồn tại, username đã dùng)
 * Status code: 409 Conflict
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}

