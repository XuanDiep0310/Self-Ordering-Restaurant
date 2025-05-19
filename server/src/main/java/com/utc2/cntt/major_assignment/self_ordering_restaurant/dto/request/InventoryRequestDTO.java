package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequestDTO {
    private Integer ingredientId; // ID của nguyên liệu
    private Integer supplierId;   // ID của nhà cung cấp
    private Long quantity;        // Số lượng
    private String unit;          // Đơn vị
}
