package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.FeedbackResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerFeedbackResponseDTO {
    private Integer orderId;
    private Integer tableNumber;
    private int rating;
    private String name;
    private String comment;
    private LocalDateTime createAt;

}
