package com.java.kltn.models.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDayDTO {
    private Integer day;
    private String date;
    private String theme;
    private List<ItineraryActivityDTO> activities;
}
