package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TableRequestDTO {
    private int capacity;
    private String location;
    private TableStatus status;
}
