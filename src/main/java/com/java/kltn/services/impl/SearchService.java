package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final Map<String, Map<String, Object>> savedSearches = Collections.synchronizedMap(new HashMap<>());
    private Long nextSearchId = 1L;

    public List<Map<String, Object>> globalSearch(String q, String category, String location, int skip, int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        // Simulate search results
        if (q != null && !q.isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", 1);
            result.put("name", "Search result for: " + q);
            result.put("category", category);
            result.put("location", location);
            results.add(result);
        }
        return results;
    }

    public List<Map<String, Object>> searchByCategory(String category, int skip, int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        result.put("id", 1);
        result.put("name", "Item in " + category);
        result.put("category", category);
        results.add(result);
        return results;
    }

    public List<Map<String, Object>> searchByLocation(String location, int skip, int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        result.put("id", 1);
        result.put("name", "Item in " + location);
        result.put("location", location);
        results.add(result);
        return results;
    }

    public List<Map<String, Object>> getTrendingDestinations(int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (int i = 1; i <= Math.min(limit, 5); i++) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", i);
            result.put("name", "Trending destination " + i);
            result.put("trending", true);
            results.add(result);
        }
        return results;
    }

    public List<Map<String, Object>> getPopularDestinations(int limit) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (int i = 1; i <= Math.min(limit, 5); i++) {
            Map<String, Object> result = new HashMap<>();
            result.put("id", i);
            result.put("name", "Popular destination " + i);
            result.put("rating", 4.5);
            results.add(result);
        }
        return results;
    }

    public List<String> autocomplete(String keyword, int limit) {
        List<String> suggestions = new ArrayList<>();
        suggestions.add(keyword + " beach");
        suggestions.add(keyword + " mountain");
        suggestions.add(keyword + " city");
        return suggestions.stream().limit(limit).toList();
    }

    public Map<String, Object> saveSearch(Map<String, Object> request) {
        String searchId = "search_" + nextSearchId++;
        Map<String, Object> search = new HashMap<>(request);
        search.put("id", searchId);
        search.put("createdAt", new Date().toString());
        savedSearches.put(searchId, search);
        return search;
    }

    public List<Map<String, Object>> getSavedSearches() {
        return new ArrayList<>(savedSearches.values());
    }

    public void deleteSavedSearch(String searchId) {
        savedSearches.remove(searchId);
    }
}
