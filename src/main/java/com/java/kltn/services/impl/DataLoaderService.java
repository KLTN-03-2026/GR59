package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.java.kltn.entities.PlaceEntity;
import com.java.kltn.repositories.PlaceRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class DataLoaderService {

    private final VectorStore vectorStore;
    private final PlaceRepository placeRepository;

    @PostConstruct
    @Transactional
    public void loadDataToVectorStore() {
        // 1. Lấy toàn bộ địa điểm từ Database để nạp vào não bộ AI (RAG)
        // Lưu ý: Hãy chạy file seed_data.sql trong MySQL trước khi chạy ứng dụng!
        List<PlaceEntity> places = placeRepository.findAll();
        List<Document> documents = new ArrayList<>();

        if (places.isEmpty()) {
            System.out.println(">>> CẢNH BÁO: CHƯA CÓ DỮ LIỆU ĐỊA ĐIỂM TRONG DATABASE. HÃY CHẠY FILE SQL.");
            return;
        }

        for (PlaceEntity place : places) {
            // Biến Entity thành một đoạn văn miêu tả để AI dễ hiểu
            String content = String.format(
                "Địa điểm: %s. Hạng mục: %s. Tỉnh: %s. Mô tả: %s. Thời gian tham quan dự kiến: 60 phút. Giá tham khảo: 0 VND.",
                place.getName(),
                place.getCategory(),
                place.getProvince() != null ? place.getProvince().getName() : "Toàn quốc",
                place.getDescription()
            );

            Document doc = new Document(content, Map.of(
                "id", place.getId().toString(),
                "name", place.getName(),
                "category", place.getCategory(),
                "province", place.getProvince() != null ? place.getProvince().getName() : ""
            ));
            documents.add(doc);
        }

        if (!documents.isEmpty()) {
            vectorStore.add(documents);
            System.out.println(">>> ĐÃ NẠP " + documents.size() + " ĐỊA ĐIỂM TỪ DATABASE VÀO NÃO BỘ AI!");
        }
    }
}
