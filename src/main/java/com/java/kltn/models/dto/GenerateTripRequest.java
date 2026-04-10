package com.java.kltn.models.dto;

import java.util.List;

public record GenerateTripRequest(
        String destination,
        String dateRange,
        Integer members,
        String budget,
        List<String> preferences
) {
}
