package com.java.kltn.exceptions;

/**
 * Exception khi xác thực thất bại (authentication failed)
 * Status code: 401 Unauthorized
 * Sử dụng khi: Email/mật khẩu sai, token không hợp lệ, hoặc xác thực thất bại
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }
    
    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

