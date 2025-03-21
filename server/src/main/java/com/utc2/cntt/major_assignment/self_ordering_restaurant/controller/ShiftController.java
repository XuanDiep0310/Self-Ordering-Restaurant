package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.AssignStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.ShiftRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.ShiftResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.ShiftService;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Autowired
    ShiftService shiftService;

    @GetMapping
    public ResponseEntity<List<ShiftResponseDTO>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @GetMapping("/{shift_id}")
    public ResponseEntity<ShiftResponseDTO> getShiftById(@PathVariable("shift_id") Integer shiftId) {
        return ResponseEntity.ok(shiftService.getShiftById(shiftId));
    }

    @PostMapping
    public ResponseEntity<ShiftResponseDTO> createShift(@RequestBody ShiftRequestDTO shiftRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shiftService.createShift(shiftRequestDTO));
    }

    @PutMapping("/{shift_id}")
    public ResponseEntity<ShiftResponseDTO> updateShift(
            @PathVariable("shift_id") Integer shiftId,
            @RequestBody ShiftRequestDTO shiftRequestDTO) {
        return ResponseEntity.ok(shiftService.updateShift(shiftId, shiftRequestDTO));
    }

    @DeleteMapping("/{shift_id}")
    public ResponseEntity<String> deleteShiftById(@PathVariable("shift_id") Integer shiftId) {
        shiftService.deleteShiftById(shiftId);
        return ResponseEntity.ok("Shift deleted successfully!");
    }
}
