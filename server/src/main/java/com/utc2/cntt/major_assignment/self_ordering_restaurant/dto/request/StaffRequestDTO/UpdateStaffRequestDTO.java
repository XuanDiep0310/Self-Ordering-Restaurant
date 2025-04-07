package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffRequestDTO {
    private String username;
    private String fullname;
    private String email;
    private String phone;
    private String password;
}
