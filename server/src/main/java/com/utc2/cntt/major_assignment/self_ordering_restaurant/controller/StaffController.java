package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    StaffService staffService;

    @GetMapping
    public ResponseEntity<List<StaffResponseDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }
}
