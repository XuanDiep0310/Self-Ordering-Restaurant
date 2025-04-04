package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UserRequestDTO.RegisterRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    public AuthService authService;

    @PostMapping("/staff/register")
    public ResponseEntity<?> registerStaff(@Valid @RequestBody RegisterRequestDTO request) {
        authService.registerStaff(request);
        return ResponseEntity.ok("Staff registered successfully!");
    }

}
