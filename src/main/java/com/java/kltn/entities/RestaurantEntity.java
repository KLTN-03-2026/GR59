package com.java.kltn.entities;

import com.java.kltn.enums.RestaurantCuisine;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
@EqualsAndHashCode(callSuper = true)
public class RestaurantEntity extends BaseServiceEntity {


    @ElementCollection
    @CollectionTable(
            name = "restaurant_gallery",
            joinColumns = @JoinColumn(name = "restaurant_id", referencedColumnName = "id")
    )
    @Column(name = "image_url")
    private List<String> gallery = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "cuisine", length = 50)
    private RestaurantCuisine category;

}