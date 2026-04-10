package com.java.kltn.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Base Entity class chứa các trường chung cho tất cả entities
 */
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}

