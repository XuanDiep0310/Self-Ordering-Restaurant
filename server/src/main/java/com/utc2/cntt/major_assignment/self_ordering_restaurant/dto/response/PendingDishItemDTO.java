package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingDishItemDTO {
    private String dishName;
    private int quantity;
    private String notes;
    private String image;

    public PendingDishItemDTO(String dishName, String image, int quantity) {
        this.dishName = dishName;
        this.image = image;
        this.quantity = quantity;
    }
}
