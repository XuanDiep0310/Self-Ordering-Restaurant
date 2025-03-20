package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusDTO {
    private OrderStatus status = OrderStatus.Pending;
}
