package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingDishItemDTO {
    private String dishName;
    private int quantity;
    private String notes;
    private String image;
    private OrderItemStatus status;
}
