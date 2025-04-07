package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.UpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

    // Cập nhật thông tin nhân viên
    @PatchMapping("/{staffId}")
    public ResponseEntity<String> patchStaff(
            @PathVariable Integer staffId,
            @RequestBody UpdateStaffRequestDTO request) {

        try {
            staffService.patchStaff(staffId, request);
            return ResponseEntity.ok("Staff information updated successfully!");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    // Lấy thông tin hồ sơ nhân viên
    @GetMapping("/profile/{staffId}")
    public ResponseEntity<StaffResponseDTO> getStaffProfile(@PathVariable Integer staffId) {
        try {
            // Lấy thông tin nhân viên từ service
            StaffResponseDTO staffResponse = staffService.getStaffById(staffId);
            return ResponseEntity.ok(staffResponse);  // Trả về đối tượng StaffResponseDTO
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(null);  // Trả về null nếu không tìm thấy nhân viên
        }
    }
}

