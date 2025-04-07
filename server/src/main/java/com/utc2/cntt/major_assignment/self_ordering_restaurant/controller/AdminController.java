package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.AdminUpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UserRequestDTO.RegisterRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.AuthService;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AuthService authService;
    private final StaffService staffService;

    @PostMapping("/staff/register")
    public ResponseEntity<?> registerStaff(@Valid @RequestBody RegisterRequestDTO request) {
        authService.registerStaff(request);
        return ResponseEntity.ok("Staff registered successfully!");
    }

    // getAllStaff
    @GetMapping("/staff")
    public ResponseEntity<List<StaffResponseDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    // getStaffById
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Integer staffId) {
        return ResponseEntity.ok(staffService.getStaffById(staffId));
    }

    // updateStaff
    @PutMapping("/staff/{staffId}")
    public ResponseEntity<?> adminUpdateStaff(
            @PathVariable Integer staffId,
            @Valid @RequestBody AdminUpdateStaffRequestDTO request) {
        staffService.adminUpdateStaff(staffId, request);
        return ResponseEntity.ok("Staff updated successfully!");
    }

    // deleteStaff
    @DeleteMapping("/staff/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable Integer staffId) {
        staffService.deleteStaff(staffId);
        return ResponseEntity.ok("Staff deleted successfully!");
    }
}
