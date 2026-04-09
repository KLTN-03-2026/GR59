package com.java.kltn.exceptions;

/**
 * Exception khi tham số không hợp lệ
 * Extends RuntimeException để KHÔNG CẦN khai báo throws
 */
public class InvalidParamException extends RuntimeException {
    public InvalidParamException(String message) {
        super(message);
    }
}
