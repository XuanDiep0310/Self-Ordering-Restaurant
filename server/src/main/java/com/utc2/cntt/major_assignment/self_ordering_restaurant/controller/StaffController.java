package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.UpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceExistsException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.StaffService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class StaffController {
    private final StaffService staffService;

    // Cập nhật thông tin nhân viên
    @PatchMapping("/profile/{username}")
    public ResponseEntity<?> patchStaffByUsername(
            @PathVariable String username,
            @RequestBody UpdateStaffRequestDTO request) {
        log.info("Received PATCH request for staff: {}", username);
        try {
            staffService.patchStaffByUsername(username, request);
            log.info("Staff information updated successfully for: {}", username);
            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "Staff information updated successfully!"
            ));
        } catch (ResourceNotFoundException e) {
            log.error("Staff not found: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (ResourceExistsException | ValidationException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error updating staff: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred. Please try again later."
                    ));
        }
    }

    // Lấy thông tin nhân viên theo username
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getStaffByUsername(@PathVariable String username) {
        log.info("Received GET request for staff profile: {}", username);
        try {
            StaffResponseDTO staffResponse = staffService.getStaffByUsername(username);
            log.info("Successfully retrieved profile for: {}", username);
            return ResponseEntity.ok(staffResponse);
        } catch (ResourceNotFoundException e) {
            log.error("Staff profile not found: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error retrieving staff profile: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred. Please try again later."
                    ));
        }
    }
}