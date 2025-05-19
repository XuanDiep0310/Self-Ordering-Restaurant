package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.FeedbackRequestDTO.CustomerFeedbackRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.ICustomerFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/feedback")
public class CustomerFeedbackController {

    private final ICustomerFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<String> createFeedback(@RequestBody CustomerFeedbackRequestDTO request) {
        feedbackService.createFeedback(request);
        return new ResponseEntity<>("Feedback created successfully", HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAllFeedbacks() {
        return new ResponseEntity<>(feedbackService.getAllFeedbacks(), HttpStatus.OK);
    }
}