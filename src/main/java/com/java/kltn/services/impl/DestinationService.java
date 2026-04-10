package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DestinationService {

    // In-memory destination storage
    private final Map<String, Map<String, Object>> destinations = Collections.synchronizedMap(new HashMap<>());
    private final Map<String, List<Map<String, Object>>> destinationReviews = Collections.synchronizedMap(new HashMap<>());

    public List<Map<String, Object>> searchDestinations(String keyword) {
        return destinations.values().stream()
                .filter(d -> {
                    String title = (String) d.get("title");
                    String description = (String) d.get("description");
                    return (title != null && title.toLowerCase().contains(keyword.toLowerCase())) ||
                           (description != null && description.toLowerCase().contains(keyword.toLowerCase()));
                })
                .toList();
    }

    public Map<String, Object> getDestinationBySlug(String slug) {
        return destinations.getOrDefault(slug, new HashMap<>());
    }

    public List<Map<String, Object>> getDestinationReviews(Long destinationId, int skip, int limit) {
        String key = "dest_" + destinationId;
        List<Map<String, Object>> reviews = destinationReviews.getOrDefault(key, new ArrayList<>());
        
        int end = Math.min(skip + limit, reviews.size());
        return reviews.subList(skip, end);
    }

    public List<Map<String, Object>> getDestinationServices(Long destinationId, String type, int skip, int limit) {
        // Returns services (hotels, restaurants, tours) for this destination
        List<Map<String, Object>> services = new ArrayList<>();
        
        // Simulate returning services of the specified type
        Map<String, Object> sample = new HashMap<>();
        sample.put("id", 1);
        sample.put("name", type + " in destination " + destinationId);
        sample.put("type", type);
        sample.put("rating", 4.5);
        services.add(sample);
        
        int end = Math.min(skip + limit, services.size());
        return services.subList(skip, end);
    }
}
