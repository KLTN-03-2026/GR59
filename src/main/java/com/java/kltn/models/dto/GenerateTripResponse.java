package com.java.kltn.models.dto;

import java.util.List;
import java.util.Map;

public record GenerateTripResponse(
        String title,
        String destination,
        String dateRange,
        Integer members,
        List<DayPlan> days,
        Map<String, Object> budgetEstimate
) {
    public record DayPlan(
            int dayNumber,
            List<TimeBlock> blocks
    ) {
    }

    public record TimeBlock(
            String label,
            List<Activity> activities
    ) {
    }

    public record Activity(
            String name,
            String startTime,
            String endTime,
            String activityType,
            String note
    ) {
    }
}
