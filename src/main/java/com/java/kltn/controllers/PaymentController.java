package com.java.kltn.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.impl.PaymentService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPayment(
            @RequestBody Map<String, Object> request) {
        Map<String, Object> payment = paymentService.createPayment(request);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentDetail(
            @PathVariable Long paymentId) {
        Map<String, Object> payment = paymentService.getPaymentDetail(paymentId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPaymentHistory(
            @RequestParam(defaultValue = "0") int skip,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> payments = paymentService.getPaymentHistory(skip, limit);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refundPayment(
            @PathVariable Long paymentId) {
        Map<String, Object> payment = paymentService.refundPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }
}
