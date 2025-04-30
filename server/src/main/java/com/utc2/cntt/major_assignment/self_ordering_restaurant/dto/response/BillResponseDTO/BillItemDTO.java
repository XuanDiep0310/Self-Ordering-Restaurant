package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BillItemDTO {
    private Integer tableNumber;
    private Integer orderId;
    private String dishName;
    private Integer quantity;
    private Long unitPrice;
    private Long subTotal;
    private Long totalAmount;
    private LocalDateTime orderDate;
}
