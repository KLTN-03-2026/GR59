package com.java.kltn.entities;

import com.java.kltn.enums.AttractionCategory;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "attractions")
@Data
@EqualsAndHashCode(callSuper = true)
public class AttractionEntity extends BaseServiceEntity {


    @ElementCollection
    @CollectionTable(
            name = "attraction_gallery",
            joinColumns = @JoinColumn(name = "attraction_id", referencedColumnName = "id")
    )
    @Column(name = "image_url")
    private List<String> gallery = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50)
    private AttractionCategory category;

}