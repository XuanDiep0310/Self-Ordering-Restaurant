package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTableStatusDTO {
    private TableStatus status;
}
