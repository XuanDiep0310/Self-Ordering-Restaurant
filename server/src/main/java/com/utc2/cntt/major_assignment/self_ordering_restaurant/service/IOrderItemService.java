package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;

public interface IOrderItemService {
    void updateOrderItemStatus(Integer orderItemId, OrderItemStatus status);
}
