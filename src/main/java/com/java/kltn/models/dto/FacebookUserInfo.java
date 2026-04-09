package com.java.kltn.models.dto;

import lombok.Data;

@Data
public class FacebookUserInfo {
    private String id;
    private String name;
    private String email;
    private Picture picture;

    @Data
    public static class Picture {
        private PictureData data;
    }

    @Data
    public static class PictureData {
        private String url;
    }
}