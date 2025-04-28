package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.FeedbackRequestDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerFeedbackRequestDTO {
    private Integer orderId;
    private Integer tableNumber;
    private int rating;
    private String name;
    private String comment;
}
