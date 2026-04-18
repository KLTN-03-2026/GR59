package com.java.kltn.entities;

import com.java.kltn.enums.HotelType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@EqualsAndHashCode(callSuper = true)
public class HotelEntity extends BaseServiceEntity {


    @ElementCollection
    @CollectionTable(
            name = "hotel_gallery",
            joinColumns = @JoinColumn(name = "hotel_id", referencedColumnName = "id") // Chỗ này phải trỏ vào bảng Hotel
    )
    @Column(name = "image_url")
    private List<String> gallery = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "hotel_type", length = 50)
    private HotelType category;

}