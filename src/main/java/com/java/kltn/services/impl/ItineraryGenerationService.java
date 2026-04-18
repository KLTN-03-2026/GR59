package com.java.kltn.services.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.models.dto.GeneratedItineraryDTO;
import com.java.kltn.models.dto.ItineraryActivityDTO;
import com.java.kltn.models.dto.ItineraryDayDTO;
import com.java.kltn.models.request.GenerateItineraryRequest;
import com.java.kltn.services.IItineraryGenerationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItineraryGenerationService implements IItineraryGenerationService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    private static final String[] TRIP_THEMES = {
            "Trải nghiệm văn hóa & lịch sử",
            "Khám phá thiên nhiên & trekking",
            "Thưởng thức ẩm thực địa phương",
            "Sống chậm & thư giãn",
            "Mạo hiểm & thể thao"
    };

    private static final String[] ATTRACTION_IMAGES = {
            "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
    };

    @Override
    public List<GeneratedItineraryDTO> generateItineraries(GenerateItineraryRequest request) {
        Integer numberOfItineraries = request.getNumberOfItineraries() != null
                ? Math.min(request.getNumberOfItineraries(), 5)
                : 3;

        List<GeneratedItineraryDTO> itineraries = new ArrayList<>();

        for (int i = 0; i < numberOfItineraries; i++) {
            try {
                GeneratedItineraryDTO itinerary = generateSingleItinerary(request);
                if (itinerary != null) {
                    itinerary.setId(String.valueOf(System.nanoTime() + i));
                    itineraries.add(itinerary);
                }
            } catch (Exception e) {
                log.error("Error generating itinerary " + i, e);
            }
        }

        return itineraries;
    }

    @Override
    public GeneratedItineraryDTO generateSingleItinerary(GenerateItineraryRequest request) {
        String theme = TRIP_THEMES[(int) (Math.random() * TRIP_THEMES.length)];
        String imageUrl = ATTRACTION_IMAGES[(int) (Math.random() * ATTRACTION_IMAGES.length)];

        String prompt = buildPrompt(request, theme);

        try {
            String content = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            // Parse JSON from AI response
            JsonNode jsonNode = objectMapper.readTree(content);

            GeneratedItineraryDTO itinerary = GeneratedItineraryDTO.builder()
                    .tripName(jsonNode.path("trip_name").asText(request.getDestination() + " - " + theme))
                    .duration(request.getDuration())
                    .price(request.getBudget())
                    .rating(4.0 + Math.random() * 0.9)  // 4.0-4.9 rating
                    .img(imageUrl)
                    .location(request.getDestination())
                    .category(getCategory(request.getPreferences()))
                    .maxPeople(request.getMembers())
                    .itinerary(parseItinerary(jsonNode, request.getDuration()))
                    .build();

            return itinerary;

        } catch (Exception e) {
            log.error("Error parsing AI response", e);
            return buildFallbackItinerary(request, theme, imageUrl);
        }
    }

    private String buildPrompt(GenerateItineraryRequest request, String theme) {
        return String.format("""
            Bạn là nhân viên tư vấn du lịch chuyên nghiệp. Hãy tạo lịch trình du lịch chi tiết cho khách hàng.
            
            Yêu cầu:
            - Điểm đến: %s
            - Thời gian: %s
            - Số người: %d
            - Budget: %d VNĐ
            - Sở thích: %s
            - Chủ đề: %s
            
            Tạo JSON với cấu trúc CHÍNH XÁC sau (không markdown, không code fence):
            {
              "trip_name": "Tên lịch trình hấp dẫn",
              "days": [
                {
                  "day": 1,
                  "date": "2024-05-01",
                  "theme": "Chủ đề ngày 1",
                  "activities": [
                    {
                      "time": "08:00",
                      "location": "Địa điểm",
                      "note": "Ghi chú chi tiết"
                    }
                  ]
                }
              ]
            }
            
            Yêu cầu:
            - Tổng cộng %d ngày (từ "Day 1" đến "Day %d")
            - Mỗi ngày tối thiểu 3 activities
            - Format time: HH:mm (24-hour)
            - Dates: 2024-05-01, 2024-05-02, ...
            - Ghi chú phải hữu ích & cụ thể
            - Ngôn ngữ: Tiếng Việt
            - Trả về CHỈ JSON, không có text khác
            """,
                request.getDestination(),
                request.getDuration(),
                request.getMembers(),
                request.getBudget(),
                String.join(", ", request.getPreferences()),
                theme,
                extractDays(request.getDuration()),
                extractDays(request.getDuration())
        );
    }

    private int extractDays(String duration) {
        // Extract number from "5 ngày 4 đêm" -> 5
        String[] parts = duration.split(" ");
        try {
            return Integer.parseInt(parts[0]);
        } catch (Exception e) {
            return 5;
        }
    }

    private List<ItineraryDayDTO> parseItinerary(JsonNode jsonNode, String duration) {
        List<ItineraryDayDTO> days = new ArrayList<>();

        JsonNode daysArray = jsonNode.path("days");
        if (daysArray.isArray()) {
            daysArray.forEach(dayNode -> {
                ItineraryDayDTO day = ItineraryDayDTO.builder()
                        .day(dayNode.path("day").asInt())
                        .date(dayNode.path("date").asText())
                        .theme(dayNode.path("theme").asText())
                        .activities(parseActivities(dayNode.path("activities")))
                        .build();
                days.add(day);
            });
        }

        return days.isEmpty() ? buildFallbackDays(duration) : days;
    }

    private List<ItineraryActivityDTO> parseActivities(JsonNode activitiesArray) {
        List<ItineraryActivityDTO> activities = new ArrayList<>();

        if (activitiesArray.isArray()) {
            activitiesArray.forEach(activity -> {
                ItineraryActivityDTO act = ItineraryActivityDTO.builder()
                        .time(activity.path("time").asText())
                        .location(activity.path("location").asText())
                        .note(activity.path("note").asText())
                        .build();
                activities.add(act);
            });
        }

        return activities;
    }

    private List<ItineraryDayDTO> buildFallbackDays(String duration) {
        int days = extractDays(duration);
        List<ItineraryDayDTO> fallbackDays = new ArrayList<>();

        for (int i = 1; i <= days; i++) {
            List<ItineraryActivityDTO> activities = new ArrayList<>();
            activities.add(ItineraryActivityDTO.builder()
                    .time("08:00")
                    .location("Điểm tham quan " + i)
                    .note("Khám phá địa điểm nổi tiếng")
                    .build());
            activities.add(ItineraryActivityDTO.builder()
                    .time("12:00")
                    .location("Nhà hàng địa phương")
                    .note("Thưởng thức ẩm thực")
                    .build());
            activities.add(ItineraryActivityDTO.builder()
                    .time("18:00")
                    .location("Điểm check-in buổi tối")
                    .note("Chụp ảnh hoàng hôn")
                    .build());

            fallbackDays.add(ItineraryDayDTO.builder()
                    .day(i)
                    .date(LocalDate.now().plusDays(i - 1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .theme("Ngày " + i + " - Khám phá")
                    .activities(activities)
                    .build());
        }

        return fallbackDays;
    }

    private GeneratedItineraryDTO buildFallbackItinerary(GenerateItineraryRequest request, String theme,
                                                         String imageUrl) {
        return GeneratedItineraryDTO.builder()
                .tripName(request.getDestination() + " - " + theme)
                .duration(request.getDuration())
                .price(request.getBudget())
                .rating(4.5)
                .img(imageUrl)
                .location(request.getDestination())
                .category(getCategory(request.getPreferences()))
                .maxPeople(request.getMembers())
                .itinerary(buildFallbackDays(request.getDuration()))
                .build();
    }

    private String getCategory(List<String> preferences) {
        if (preferences == null || preferences.isEmpty()) {
            return "mixed";
        }

        String pref = preferences.get(0).toLowerCase();
        if (pref.contains("trekking") || pref.contains("nature") || pref.contains("thiên nhiên")) {
            return "nature";
        } else if (pref.contains("culture") || pref.contains("văn hóa") || pref.contains("lịch sử")) {
            return "culture";
        } else if (pref.contains("food") || pref.contains("ẩm thực")) {
            return "food";
        } else if (pref.contains("relax") || pref.contains("thư giãn")) {
            return "relax";
        }
        return "mixed";
    }
}
