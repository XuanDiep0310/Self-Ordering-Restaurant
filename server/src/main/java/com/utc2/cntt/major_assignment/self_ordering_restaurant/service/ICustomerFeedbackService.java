package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.FeedbackRequestDTO.CustomerFeedbackRequestDTO;

import java.util.List;

public interface ICustomerFeedbackService {
    void createFeedback(CustomerFeedbackRequestDTO request);
    List<?> getAllFeedbacks();
}
