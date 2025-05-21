package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemStatusRequestDTO {
    private OrderItemStatus status;
}
