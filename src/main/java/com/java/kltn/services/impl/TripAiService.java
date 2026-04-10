package com.java.kltn.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.models.dto.GenerateTripRequest;
import com.java.kltn.models.dto.GenerateTripResponse;
import com.java.kltn.services.ITripGenerator;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class TripAiService implements ITripGenerator {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public TripAiService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder
                .defaultSystem("Bạn là nhân viên tư vấn du lịch. Hãy xây dựng lịch trình HOÀN TOÀN dựa trên các thông tin Tour/Tài liệu được cung cấp. Không tự bịa đặt trái với tài liệu.")
                .defaultAdvisors(new QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults()))
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public GenerateTripResponse generate(GenerateTripRequest req) {
        var destination = safe(req.destination());
        var dateRange = safe(req.dateRange());
        var budget = safe(req.budget());
        var members = req.members() == null ? 2 : req.members();
        var preferences = req.preferences() == null ? List.<String>of() : req.preferences();

        String prompt = """
                Bạn là trợ lý du lịch. Hãy tạo lịch trình du lịch chi tiết và TRẢ VỀ DUY NHẤT JSON (không markdown, không code fence).
                Yêu cầu:
                - Ngôn ngữ: tiếng Việt.
                - title dạng: "Khám phá <destination>".
                - dateRange giữ nguyên như input.
                - days: mảng theo ngày, mỗi ngày có blocks gồm "BUỔI SÁNG", "BUỔI CHIỀU", "BUỔI TỐI".
                - Mỗi activity có: name, startTime (HH:mm), endTime (HH:mm), activityType (ví dụ: FOOD, NATURE, CULTURE, NIGHTLIFE, RELAX), note (ngắn).
                - budgetEstimate: object ước tính chi phí theo hạng mục (di_chuyen, an_uong, ve_tham_quan, luu_tru, tong) theo VND (số).
                
                Input:
                destination=%s
                dateRange=%s
                members=%d
                budget=%s
                preferences=%s
                
                Cấu trúc JSON bắt buộc phải trả về (tuyệt đối không dùng markdown, không chứa dấu ngoặc kép bọc ngoài):
                - title (String)
                - destination (String)
                - dateRange (String)
                - members (Integer)
                - days (Danh sách các ngày)
                   + dayNumber (Integer)
                   + blocks (Danh sách các buổi trong ngày)
                      * label (String: BUỔI SÁNG / BUỔI CHIỀU / BUỔI TỐI)
                      * activities (Danh sách các hoạt động)
                         > name (String)
                         > startTime (String, format HH:mm)
                         > endTime (String, format HH:mm)
                         > activityType (String: FOOD, NATURE, CULTURE, NIGHTLIFE, RELAX)
                         > note (String)
                - budgetEstimate (Object chứa các integer: di_chuyen, an_uong, ve_tham_quan, luu_tru, tong)
                """.formatted(destination, dateRange, members, budget, preferences);

        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        try {
            return objectMapper.readValue(content, GenerateTripResponse.class);
        } catch (Exception ex) {
            return new GenerateTripResponse(
                    "Khám phá " + destination,
                    destination,
                    dateRange,
                    members,
                    List.of(),
                    null
            );
        }
    }

    private static String safe(String s) {
        return s == null ? "" : s.trim();
    }
}
