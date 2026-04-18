package com.java.kltn.services;

import java.util.List;

import com.java.kltn.models.dto.GeneratedItineraryDTO;
import com.java.kltn.models.request.GenerateItineraryRequest;

public interface IItineraryGenerationService {

    /**
     * Generate multiple AI-powered itineraries
     * @param request User requirements (destination, duration, budget, preferences)
     * @return List of generated itineraries (default 3, max 5)
     */
    List<GeneratedItineraryDTO> generateItineraries(GenerateItineraryRequest request);

    /**
     * Generate single itinerary
     */
    GeneratedItineraryDTO generateSingleItinerary(GenerateItineraryRequest request);
}
