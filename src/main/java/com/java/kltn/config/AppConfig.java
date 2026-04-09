package com.java.kltn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration // Đánh dấu đây là file cấu hình
public class AppConfig {

    @Bean // Dạy Spring cách tạo RestTemplate
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
