package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.DishStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DishResponseDTO {
    private Integer dishId;
    private String name;
    private BigDecimal price;
    private DishStatus status = DishStatus.Available;
}
