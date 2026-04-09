package com.java.kltn.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.responses.ApiResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*")
public class TestimonialController {

    @GetMapping("/testimonials")
    public ResponseEntity<ApiResponse<Object[]>> getTestimonials() {
        // TODO: Implement get testimonials
        return ResponseEntity.ok(ApiResponse.success("Success", new Object[0]));
    }
}
