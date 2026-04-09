package com.java.kltn.services;

import com.java.kltn.models.request.LoginRequest;
import com.java.kltn.models.request.RegisterRequest;
import com.java.kltn.models.responses.AuthResponse;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
