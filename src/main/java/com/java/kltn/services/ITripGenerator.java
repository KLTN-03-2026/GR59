package com.java.kltn.services;

import com.java.kltn.models.dto.GenerateTripRequest;
import com.java.kltn.models.dto.GenerateTripResponse;

public interface ITripGenerator {
    GenerateTripResponse generate(GenerateTripRequest req);
}
