package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponseDTO {
    private Integer staffId;
    private String fullname;
    private String email;
    private String phone;
    private String position;
    private String salary;
}
