//package com.java.kltn.services.impl;
//
//import com.java.kltn.entities.AttractionEntity;
//import com.java.kltn.entities.HotelEntity;
//import com.java.kltn.entities.RestaurantEntity;
//import com.java.kltn.repositories.AttractionRepository;
//import com.java.kltn.repositories.HotelRepository;
//import com.java.kltn.repositories.RestaurantRepository;
//import com.java.kltn.services.ITravelService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class TravelServiceImpl implements ITravelService {
//
//    private final HotelRepository hotelRepo;
//    private final RestaurantRepository restRepo;
//    private final AttractionRepository attrRepo;
//
//    // --- LOGIC CHO HOTEL ---
//    @Override
//    public HotelEntity saveHotel(HotelEntity hotel) {
//        return hotelRepo.save(hotel);
//    }
//
//    @Override
//    public HotelEntity updateHotel(Long id, HotelEntity details) {
//        HotelEntity hotel = hotelRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn id: " + id));
//        // Copy các trường từ details sang hotel, bỏ qua trường "id"
//        BeanUtils.copyProperties(details, hotel, "id");
//        return hotelRepo.save(hotel);
//    }
//
//    @Override
//    public List<HotelEntity> getAllHotels() {
//        return hotelRepo.findAll();
//    }
//
//    // --- LOGIC CHO RESTAURANT ---
//    @Override
//    public RestaurantEntity saveRestaurant(RestaurantEntity restaurant) {
//        return restRepo.save(restaurant);
//    }
//
//    @Override
//    public RestaurantEntity updateRestaurant(Long id, RestaurantEntity details) {
//        RestaurantEntity rest = restRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà hàng id: " + id));
//        BeanUtils.copyProperties(details, rest, "id");
//        return restRepo.save(rest);
//    }
//
//    @Override
//    public List<RestaurantEntity> getAllRestaurants() {
//        return restRepo.findAll();
//    }
//
//    // --- LOGIC CHO ATTRACTION ---
//    @Override
//    public AttractionEntity saveAttraction(AttractionEntity attraction) {
//        return attrRepo.save(attraction);
//    }
//
//    @Override
//    public AttractionEntity updateAttraction(Long id, AttractionEntity details) {
//        AttractionEntity attr = attrRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa điểm id: " + id));
//        BeanUtils.copyProperties(details, attr, "id");
//        return attrRepo.save(attr);
//    }
//
//    @Override
//    public List<AttractionEntity> getAllAttractions() {
//        return attrRepo.findAll();
//    }
//
//    // --- LOGIC XÓA CHUNG ---
//    @Override
//    public void deleteEntity(String type, Long id) {
//        switch (type.toLowerCase()) {
//            case "hotel" -> hotelRepo.deleteById(id);
//            case "restaurant" -> restRepo.deleteById(id);
//            case "attraction" -> attrRepo.deleteById(id);
//            default -> throw new RuntimeException("Loại thực thể không hợp lệ");
//        }
//    }
//}