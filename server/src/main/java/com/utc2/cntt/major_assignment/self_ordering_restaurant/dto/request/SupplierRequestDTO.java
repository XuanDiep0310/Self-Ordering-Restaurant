package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierRequestDTO {
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
}
