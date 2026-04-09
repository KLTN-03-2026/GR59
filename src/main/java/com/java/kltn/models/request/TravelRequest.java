package com.java.kltn.models.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelRequest {

    private String destination;
    private String dates;
    private List<String> interests;
    private String budget;
    private String groupType;
}

