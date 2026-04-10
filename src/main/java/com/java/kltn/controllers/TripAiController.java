package com.java.kltn.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.kltn.models.dto.GenerateTripRequest;
import com.java.kltn.models.dto.GenerateTripResponse;
import com.java.kltn.models.responses.ApiResponse;
import com.java.kltn.services.ITripGenerator;

@RestController
@RequestMapping("/api/ai/trips")
@CrossOrigin(origins = "*")
public class TripAiController {

    private final ITripGenerator tripAiService;

    public TripAiController(ITripGenerator tripAiService) {
        this.tripAiService = tripAiService;
    }

    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<GenerateTripResponse>> generate(@RequestBody GenerateTripRequest request) {
        GenerateTripResponse response = tripAiService.generate(request);
        return ResponseEntity.ok(ApiResponse.success("Itinerary generated", response));
    }
}

