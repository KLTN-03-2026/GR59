//package com.java.kltn.controllers;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.java.kltn.services.ITravelService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/v1/admin")
//@RequiredArgsConstructor
//public class AdminTravelController {
//
//    private final ITravelService travelService;
//
//    @DeleteMapping("/{type}/{id}")
//    public ResponseEntity<?> delete(@PathVariable String type, @PathVariable Long id) {
//        travelService.deleteEntity(type, id);
//        return ResponseEntity.ok("Đã xóa thành công!");
//    }
//}