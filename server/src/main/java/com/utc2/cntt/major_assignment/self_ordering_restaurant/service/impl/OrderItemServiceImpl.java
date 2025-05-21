package com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.OrderItems;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.OrderItemRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.IOrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements IOrderItemService {
    private final OrderItemRepository orderItemRepository;

    @Override
    public void updateOrderItemStatus(Integer orderItemId, OrderItemStatus status) {
        OrderItems orderItem = orderItemRepository.findByOrderItemId(orderItemId);
        if (orderItem != null) {
            orderItem.setStatus(status);
            orderItemRepository.save(orderItem);
        } else {
            throw new IllegalArgumentException("Order item not found with ID: " + orderItemId);
        }
    }
}
