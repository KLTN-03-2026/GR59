package com.java.kltn.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    // In-memory storage for payments
    private final Map<Long, Map<String, Object>> payments = Collections.synchronizedMap(new HashMap<>());
    private Long nextPaymentId = 1L;

    @Transactional
    public Map<String, Object> createPayment(Map<String, Object> request) {
        Long paymentId = nextPaymentId++;
        
        Map<String, Object> payment = new HashMap<>(request);
        payment.put("id", paymentId);
        payment.put("status", "pending");
        payment.put("createdAt", LocalDateTime.now().toString());
        
        payments.put(paymentId, payment);
        return payment;
    }

    public Map<String, Object> getPaymentDetail(Long paymentId) {
        return payments.getOrDefault(paymentId, new HashMap<>());
    }

    public List<Map<String, Object>> getPaymentHistory(int skip, int limit) {
        List<Map<String, Object>> allPayments = new ArrayList<>(payments.values());
        int end = Math.min(skip + limit, allPayments.size());
        return allPayments.subList(skip, end);
    }

    @Transactional
    public Map<String, Object> refundPayment(Long paymentId) {
        Map<String, Object> payment = payments.get(paymentId);
        if (payment != null) {
            payment.put("status", "refunded");
            payment.put("updatedAt", LocalDateTime.now().toString());
            payments.put(paymentId, payment);
        }
        return payment;
    }
}
