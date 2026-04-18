//package com.java.kltn.services;
//
//import com.java.kltn.entities.AttractionEntity;
//import com.java.kltn.entities.HotelEntity;
//import com.java.kltn.entities.RestaurantEntity;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//
//public interface ITravelService {
//    // Hotel
//    HotelEntity saveHotel(HotelEntity hotel);
//    HotelEntity updateHotel(Long id, HotelEntity hotel);
//    List<HotelEntity> getAllHotels();
//
//    // Restaurant
//    RestaurantEntity saveRestaurant(RestaurantEntity restaurant);
//    RestaurantEntity updateRestaurant(Long id, RestaurantEntity restaurant);
//    List<RestaurantEntity> getAllRestaurants();
//
//    // Attraction
//    AttractionEntity saveAttraction(AttractionEntity attraction);
//    AttractionEntity updateAttraction(Long id, AttractionEntity attraction);
//    List<AttractionEntity> getAllAttractions();
//
//    void deleteEntity(String type, Long id);
//}