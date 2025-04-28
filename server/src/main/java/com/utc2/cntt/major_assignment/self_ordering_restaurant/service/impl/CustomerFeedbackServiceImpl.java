package com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.FeedbackRequestDTO.CustomerFeedbackRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.FeedbackResponseDTO.CustomerFeedbackResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.CustomerFeedback;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Orders;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.FeedbackStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CustomerFeedbackRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.OrderRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.ICustomerFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor


@Service
public class CustomerFeedbackServiceImpl implements ICustomerFeedbackService {

    private final CustomerFeedbackRepository feedbackRepository;
    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;

    @Override
    public void createFeedback(CustomerFeedbackRequestDTO request) {
        Tables table = tableRepository.findByTableNumber(request.getTableNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));

        Orders order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        CustomerFeedback feedback = new CustomerFeedback();
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setStatus(FeedbackStatus.New); // Default status
        // Map other fields if necessary (e.g., customer, order)

        feedbackRepository.save(feedback);
    }

    @Override
    public List<CustomerFeedbackResponseDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream().map(feedback -> {
            CustomerFeedbackResponseDTO response = new CustomerFeedbackResponseDTO();
//            response.setOrderId(feedback.getOrder().getOrderId());
            response.setRating(feedback.getRating());
            response.setComment(feedback.getComment());
            response.setCreateAt(feedback.getFeedbackDate());
            return response;
        }).collect(Collectors.toList());
    }
}
