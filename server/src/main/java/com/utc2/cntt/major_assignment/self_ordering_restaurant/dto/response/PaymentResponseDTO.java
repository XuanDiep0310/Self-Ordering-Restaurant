package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponseDTO {
    private String paymentUrl;
    private String message;
    private String transactionStatus;
    private String responseCode;
}