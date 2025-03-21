package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.CategoryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {
    private Integer categoryId;
    private String name;
    private String description;
    private String image;
    private CategoryStatus status;
}
