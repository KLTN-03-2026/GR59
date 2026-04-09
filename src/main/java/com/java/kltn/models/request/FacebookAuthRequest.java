package com.java.kltn.models.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FacebookAuthRequest {

    @NotBlank(message = "Access token không được để trống")
    private String accessToken;
}