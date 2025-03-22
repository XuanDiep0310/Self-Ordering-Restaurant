package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponseDTO {
    private Integer inventoryId;
    private String ingredientName;
    private String supplierName;
    private BigDecimal quantity;
    private String unit;
    private LocalDateTime lastUpdated;
}
