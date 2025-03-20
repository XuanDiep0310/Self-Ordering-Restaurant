package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.AssignStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {
    @Autowired
    StaffShiftService staffShiftService;

    @PostMapping("/assign")
    public ResponseEntity<?> assignStaffToShift(@RequestBody AssignStaffRequestDTO assignStaffRequestDTO) {
        staffShiftService.assignStaffToShift(assignStaffRequestDTO);
        return ResponseEntity.ok("Staff assigned to shift successfully!");
    }
}
