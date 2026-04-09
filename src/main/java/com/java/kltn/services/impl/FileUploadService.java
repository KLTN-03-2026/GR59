package com.java.kltn.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final Map<String, Map<String, Object>> uploadedFiles = Collections.synchronizedMap(new HashMap<>());

    public Map<String, Object> uploadImage(MultipartFile file) {
        String publicId = "image_" + System.currentTimeMillis();
        String fileName = file.getOriginalFilename();
        
        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("url", "https://storage.example.com/" + publicId);
        fileInfo.put("publicId", publicId);
        fileInfo.put("size", file.getSize());
        fileInfo.put("type", file.getContentType());
        fileInfo.put("name", fileName);
        
        uploadedFiles.put(publicId, fileInfo);
        return fileInfo;
    }

    public List<Map<String, Object>> uploadImages(MultipartFile[] files) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(uploadImage(file));
        }
        return results;
    }

    public Map<String, Object> uploadDocument(MultipartFile file, String folder) {
        String folderPrefix = folder != null ? folder + "/" : "";
        String publicId = "doc_" + System.currentTimeMillis();
        String fileName = file.getOriginalFilename();
        
        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("url", "https://storage.example.com/" + folderPrefix + publicId);
        fileInfo.put("publicId", publicId);
        fileInfo.put("size", file.getSize());
        fileInfo.put("type", file.getContentType());
        fileInfo.put("name", fileName);
        
        uploadedFiles.put(publicId, fileInfo);
        return fileInfo;
    }

    public void deleteFile(String publicId) {
        uploadedFiles.remove(publicId);
    }
}
