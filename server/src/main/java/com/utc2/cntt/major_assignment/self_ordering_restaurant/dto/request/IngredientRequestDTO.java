package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.IngredientStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IngredientRequestDTO {
    private Integer supplierId;
    private String name;
    private String description;
    private String unit;
    private BigDecimal costPerUnit;
    private IngredientStatus status;
    private int minimumQuantity;
}
