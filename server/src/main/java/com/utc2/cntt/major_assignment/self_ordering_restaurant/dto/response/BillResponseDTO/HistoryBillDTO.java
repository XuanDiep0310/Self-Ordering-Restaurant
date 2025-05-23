package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistoryBillDTO {
    private Integer orderId;
    private Integer tableNumber;
    private Long amount;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private String dishName;
    private Long quantity;
    private Long unitPrice;
    private Long subTotal;
}
