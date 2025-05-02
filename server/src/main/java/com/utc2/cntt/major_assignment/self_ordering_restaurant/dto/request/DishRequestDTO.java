package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.DishStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DishRequestDTO {
    private String name;
    private Long price;
    private MultipartFile imageFile; // Thay đổi từ String thành MultipartFile
    private Integer categoryId;
    private DishStatus status = DishStatus.Available;
}
