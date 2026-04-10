package com.java.kltn.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.kltn.entities.TripEntity;
import com.java.kltn.entities.TripItemEntity;
import com.java.kltn.entities.UserEntity;
import com.java.kltn.models.dto.GenerateTripResponse;
import com.java.kltn.repositories.TripItemRepository;
import com.java.kltn.repositories.TripRepository;
import com.java.kltn.services.ITripService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripService implements ITripService {

    private final TripRepository tripRepository;
    private final TripItemRepository tripItemRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public TripEntity saveTripFromAI(GenerateTripResponse aiResponse, UserEntity user) {
        // 1. Tạo Trip chính
        TripEntity trip = TripEntity.builder()
                .user(user)
                .title(aiResponse.title())
                .destination(aiResponse.destination())
                .startDate(LocalDate.now()) // Tạm thời lấy ngày hiện tại, sau này có thể parse từ dateRange
                .endDate(LocalDate.now().plusDays(aiResponse.days().size() - 1))
                .status("PLANNED")
                .totalBudget(calculateTotalBudget(aiResponse.budgetEstimate()))
                .build();

        try {
            // Lưu lại cục JSON gốc để dự phòng
            trip.setAiResponseData(objectMapper.writeValueAsString(aiResponse));
        } catch (Exception ignored) {}

        TripEntity savedTrip = tripRepository.save(trip);

        // 2. Lưu từng Item (Hoạt động) trong lịch trình
        List<TripItemEntity> items = new ArrayList<>();
        for (var day : aiResponse.days()) {
            for (var block : day.blocks()) {
                for (var activity : block.activities()) {
                    TripItemEntity item = TripItemEntity.builder()
                            .trip(savedTrip)
                            .dayNumber(day.dayNumber())
                            .activityName(activity.name())
                            .activityType(activity.activityType())
                            .startTime(parseTime(activity.startTime()))
                            .endTime(parseTime(activity.endTime()))
                            .aiNote(activity.note())
                            .build();
                    items.add(item);
                }
            }
        }
        tripItemRepository.saveAll(items);
        savedTrip.setItems(items);

        return savedTrip;
    }

    // === TRIP CRUD ===
    @Transactional
    public TripEntity createTrip(Map<String, Object> tripData, UserEntity user) {
        TripEntity trip = TripEntity.builder()
                .user(user)
                .title((String) tripData.get("title"))
                .destination((String) tripData.get("destination"))
                .status("UPCOMING")
                .totalBudget(parseDouble(tripData.get("budget")))
                .build();
        
        // Parse dates
        Object startDateObj = tripData.get("startDate");
        Object endDateObj = tripData.get("endDate");
        if (startDateObj != null) {
            trip.setStartDate(parseDate(startDateObj));
        }
        if (endDateObj != null) {
            trip.setEndDate(parseDate(endDateObj));
        }
        
        return tripRepository.save(trip);
    }

    @Override
    public List<TripEntity> getUserTrips(UserEntity user) {
        return tripRepository.findByUser(user);
    }

    public List<TripEntity> getUserTripsByStatus(UserEntity user, String status) {
        List<TripEntity> allTrips = tripRepository.findByUser(user);
        if (status == null) return allTrips;
        return allTrips.stream()
                .filter(t -> status.equalsIgnoreCase(t.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public TripEntity getTripDetail(Long tripId) {
        return tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến đi"));
    }

    @Transactional
    public TripEntity updateTrip(Long tripId, Map<String, Object> updateData) {
        TripEntity trip = getTripDetail(tripId);
        
        if (updateData.containsKey("title")) {
            trip.setTitle((String) updateData.get("title"));
        }
        if (updateData.containsKey("destination")) {
            trip.setDestination((String) updateData.get("destination"));
        }
        if (updateData.containsKey("budget")) {
            trip.setTotalBudget(parseDouble(updateData.get("budget")));
        }
        if (updateData.containsKey("status")) {
            trip.setStatus((String) updateData.get("status"));
        }
        if (updateData.containsKey("startDate")) {
            trip.setStartDate(parseDate(updateData.get("startDate")));
        }
        if (updateData.containsKey("endDate")) {
            trip.setEndDate(parseDate(updateData.get("endDate")));
        }
        
        trip.setUpdatedAt(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @Override
    @Transactional
    public void deleteTrip(Long tripId) {
        tripRepository.deleteById(tripId);
    }

    // === CHECKLIST MANAGEMENT ===
    @Transactional
    public Map<String, Object> addChecklistItem(Long tripId, String label) {
        TripEntity trip = getTripDetail(tripId);
        
        TripItemEntity item = TripItemEntity.builder()
                .trip(trip)
                .activityName(label)
                .activityType("CHECKLIST")
                .build();
        
        TripItemEntity savedItem = tripItemRepository.save(item);
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", savedItem.getId());
        result.put("label", label);
        result.put("isCompleted", false);
        
        return result;
    }

    @Transactional
    public Map<String, Object> updateChecklistItem(Long tripId, Map<String, Object> itemData) {
        Long itemId = ((Number) itemData.get("id")).longValue();
        Boolean isCompleted = (Boolean) itemData.get("isCompleted");
        
        Optional<TripItemEntity> item = tripItemRepository.findById(itemId);
        if (item.isPresent()) {
            TripItemEntity entity = item.get();
            entity.setUpdatedAt(LocalDateTime.now());
            tripItemRepository.save(entity);
        }
        
        return itemData;
    }

    @Transactional
    public void deleteChecklistItem(Long tripId, Long itemId) {
        tripItemRepository.deleteById(itemId);
    }

    @Transactional
    public List<Map<String, Object>> updateFullChecklist(Long tripId, List<Map<String, Object>> checklistData) {
        // Clear old checklist items for this trip
        TripEntity trip = getTripDetail(tripId);
        

        // Add new items
        for (Map<String, Object> item : checklistData) {
            TripItemEntity entity = TripItemEntity.builder()
                    .trip(trip)
                    .activityName((String) item.get("label"))
                    .activityType("CHECKLIST")
                    .build();
            tripItemRepository.save(entity);
        }
        
        return checklistData;
    }

    // === EXPENSES MANAGEMENT ===
    @Transactional
    public Map<String, Object> addExpense(Long tripId, Map<String, Object> expenseData) {
        TripEntity trip = getTripDetail(tripId);
        
        TripItemEntity expense = TripItemEntity.builder()
                .trip(trip)
                .activityName((String) expenseData.get("description"))
                .activityType("EXPENSE")
                .aiNote((String) expenseData.get("category"))
                .build();
        
        TripItemEntity savedExpense = tripItemRepository.save(expense);
        
        Map<String, Object> result = new HashMap<>(expenseData);
        result.put("id", savedExpense.getId());
        
        return result;
    }

    public List<Map<String, Object>> getTripExpenses(Long tripId) {
        TripEntity trip = getTripDetail(tripId);
        List<TripItemEntity> items = trip.getItems();
        
        return items.stream()
                .filter(item -> "EXPENSE".equals(item.getActivityType()))
                .map(item -> {
                    Map<String, Object> expense = new HashMap<>();
                    expense.put("id", item.getId());
                    expense.put("category", item.getAiNote());
                    expense.put("description", item.getActivityName());
                    expense.put("amount", 0);
                    expense.put("date", item.getCreatedAt());
                    return expense;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> updateExpense(Long tripId, String expenseId, Map<String, Object> updateData) {
        Long id = Long.parseLong(expenseId);
        Optional<TripItemEntity> item = tripItemRepository.findById(id);
        
        if (item.isPresent()) {
            TripItemEntity entity = item.get();
            if (updateData.containsKey("description")) {
                entity.setActivityName((String) updateData.get("description"));
            }
            if (updateData.containsKey("category")) {
                entity.setAiNote((String) updateData.get("category"));
            }
            entity.setUpdatedAt(LocalDateTime.now());
            tripItemRepository.save(entity);
        }
        
        Map<String, Object> result = new HashMap<>(updateData);
        result.put("id", id);
        return result;
    }

    @Transactional
    public void deleteExpense(Long tripId, Long expenseId) {
        tripItemRepository.deleteById(expenseId);
    }

    // === HELPER METHODS ===
    private Double calculateTotalBudget(Map<String, Object> budgetMap) {
        if (budgetMap == null || !budgetMap.containsKey("tong")) return 0.0;
        Object tong = budgetMap.get("tong");
        if (tong instanceof Number) return ((Number) tong).doubleValue();
        return 0.0;
    }

    private LocalTime parseTime(String timeStr) {
        try {
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            return LocalTime.of(9, 0); // Default 9:00 AM if parse fails
        }
    }

    private Double parseDouble(Object value) {
        if (value == null) return 0.0;
        if (value instanceof Number) return ((Number) value).doubleValue();
        if (value instanceof String) {
            try {
                return Double.parseDouble((String) value);
            } catch (Exception e) {
                return 0.0;
            }
        }
        return 0.0;
    }

    private LocalDate parseDate(Object value) {
        if (value == null) return LocalDate.now();
        if (value instanceof LocalDate) return (LocalDate) value;
        if (value instanceof String) {
            try {
                return LocalDate.parse((String) value);
            } catch (Exception e) {
                return LocalDate.now();
            }
        }
        return LocalDate.now();
    }
}
