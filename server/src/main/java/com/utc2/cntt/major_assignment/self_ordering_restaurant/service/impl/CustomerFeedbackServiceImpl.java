package com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.FeedbackRequestDTO.CustomerFeedbackRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.FeedbackResponseDTO.CustomerFeedbackResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.CustomerFeedback;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.FeedbackStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CustomerFeedbackRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.OrderRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.ICustomerFeedbackService;
import lombok.RequiredArgsConstructor;
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
        CustomerFeedback feedback = new CustomerFeedback();
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setStatus(FeedbackStatus.New); // Default status

        feedbackRepository.save(feedback);
    }

    @Override
    public List<CustomerFeedbackResponseDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream().map(feedback -> {
            CustomerFeedbackResponseDTO response = new CustomerFeedbackResponseDTO();
            response.setRating(feedback.getRating());

            // Tách name và comment
            String comment = feedback.getComment();
            String name = "Khách hàng ẩn danh";
            String actualComment = comment;

            // Check for name pattern [Name: xxx]
            if (comment.startsWith("[Name:")) {
                int endBracket = comment.indexOf("]");
                if (endBracket != -1) {
                    name = comment.substring(7, endBracket).trim();
                    actualComment = comment.substring(endBracket + 1).trim();
                }
            }

            response.setName(name);
            response.setComment(actualComment);
            response.setCreateAt(feedback.getFeedbackDate());
            return response;
        }).collect(Collectors.toList());
    }
}
