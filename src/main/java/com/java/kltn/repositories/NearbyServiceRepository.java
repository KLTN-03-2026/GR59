package com.java.kltn.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.kltn.entities.NearbyServiceEntity;

@Repository
public interface NearbyServiceRepository extends JpaRepository<NearbyServiceEntity, Long> {

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.attraction.id = :attractionId AND ns.status = :status")
    List<NearbyServiceEntity> findByAttractionIdAndStatus(@Param("attractionId") Long attractionId, @Param("status") String status);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.attraction.id = :attractionId AND ns.status = :status")
    Page<NearbyServiceEntity> findByAttractionIdAndStatus(@Param("attractionId") Long attractionId, @Param("status") String status, Pageable pageable);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.attraction.id = :attractionId")
    List<NearbyServiceEntity> findByAttractionId(@Param("attractionId") Long attractionId);

    List<NearbyServiceEntity> findByServiceType(String serviceType);

    Page<NearbyServiceEntity> findByServiceType(String serviceType, Pageable pageable);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.attraction.id = :attractionId AND ns.status = 'ACTIVE' ORDER BY ns.distanceKm ASC")
    List<NearbyServiceEntity> findNearestServicesByAttraction(@Param("attractionId") Long attractionId);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.attraction.id = :attractionId AND ns.serviceType = :serviceType AND ns.status = 'ACTIVE' ORDER BY ns.distanceKm ASC")
    List<NearbyServiceEntity> findNearestServicesByAttractionAndType(@Param("attractionId") Long attractionId, @Param("serviceType") String serviceType);

    // Hotel-related queries
    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.hotel.id = :hotelId AND ns.status = :status")
    List<NearbyServiceEntity> findByHotelIdAndStatus(@Param("hotelId") Long hotelId, @Param("status") String status);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.hotel.id = :hotelId AND ns.status = :status")
    Page<NearbyServiceEntity> findByHotelIdAndStatus(@Param("hotelId") Long hotelId, @Param("status") String status, Pageable pageable);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.hotel.id = :hotelId")
    List<NearbyServiceEntity> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.hotel.id = :hotelId AND ns.status = 'ACTIVE' ORDER BY ns.distanceKm ASC")
    List<NearbyServiceEntity> findNearestServicesByHotel(@Param("hotelId") Long hotelId);

    // Restaurant-related queries
    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.restaurant.id = :restaurantId AND ns.status = :status")
    List<NearbyServiceEntity> findByRestaurantIdAndStatus(@Param("restaurantId") Long restaurantId, @Param("status") String status);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.restaurant.id = :restaurantId AND ns.status = :status")
    Page<NearbyServiceEntity> findByRestaurantIdAndStatus(@Param("restaurantId") Long restaurantId, @Param("status") String status, Pageable pageable);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.restaurant.id = :restaurantId")
    List<NearbyServiceEntity> findByRestaurantId(@Param("restaurantId") Long restaurantId);

    @Query("SELECT ns FROM NearbyServiceEntity ns WHERE ns.restaurant.id = :restaurantId AND ns.status = 'ACTIVE' ORDER BY ns.distanceKm ASC")
    List<NearbyServiceEntity> findNearestServicesByRestaurant(@Param("restaurantId") Long restaurantId);
}
