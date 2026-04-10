package com.java.kltn.services;

import com.java.kltn.models.dto.GenerateTripResponse;
import com.java.kltn.entities.TripEntity;
import com.java.kltn.entities.UserEntity;

import java.util.List;

public interface ITripService {
    TripEntity saveTripFromAI(GenerateTripResponse aiResponse, UserEntity user);
    List<TripEntity> getUserTrips(UserEntity user);
    TripEntity getTripDetail(Long tripId);
    void deleteTrip(Long tripId);
}
