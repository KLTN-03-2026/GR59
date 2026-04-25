package com.java.kltn.controllers;

import java.util.List;

import com.java.kltn.services.impl.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.dto.RecommendationDTO;
import com.java.kltn.models.request.RecommendationRequest;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.repositories.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    /**
     * Get smart recommendations for user
     * POST /api/v1/recommendations
     */
//    @PostMapping
//    public ResponseEntity<ApiResponse<List<RecommendationDTO>>> getRecommendations(
//            @Valid @RequestBody RecommendationRequest request) {
//
//        // Get current user ID from authentication
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();
//
//        UserEntity user = userRepository.findByEmail(email).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                .body(ApiResponse.error("User not found", 401));
//        }
//
//        List<RecommendationDTO> recommendations = recommendationService
//            .getSmartRecommendations(user.getId(), request);
//
//        return ResponseEntity.ok(
//            ApiResponse.success("Recommendations retrieved successfully", recommendations)
//        );
//    }
}
