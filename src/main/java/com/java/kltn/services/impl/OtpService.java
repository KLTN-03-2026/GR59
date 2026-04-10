package com.java.kltn.services.impl;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService{

    // In-memory OTP storage (for demo/graduation thesis)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    private final Map<String, Boolean> otpVerified = new ConcurrentHashMap<>();

    private static final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5);


    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(1000000));
    }


    public void saveOtp(String email, String otp) {
        otpStorage.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + OTP_VALID_DURATION);
        otpVerified.put(email, false);
    }


    public boolean verifyOtp(String email, String otp) {
        if (verifyOtpOnly(email, otp)) {
            otpVerified.put(email, true);
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return true;
        }
        return false;
    }


    public boolean verifyOtpOnly(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        Long expiry = otpExpiry.get(email);

        if (storedOtp != null && storedOtp.equals(otp) && expiry != null && expiry > System.currentTimeMillis()) {
            return true;
        }
        return false;
    }


    public boolean isOtpVerified(String email) {
        return otpVerified.getOrDefault(email, false);
    }


    public void removeOtp(String email) {
        otpStorage.remove(email);
        otpExpiry.remove(email);
        otpVerified.remove(email);
    }
}
