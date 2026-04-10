package com.java.kltn.exceptions;

/**
 * Exception khi user chưa đăng nhập hoặc không có quyền truy cập
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

