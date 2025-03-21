package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequestDTO {
    private Integer userId;
    private String fullname;
    private int points;
}
