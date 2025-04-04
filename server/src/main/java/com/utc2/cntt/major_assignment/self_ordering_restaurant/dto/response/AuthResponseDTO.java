package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private String username;
    private String email;
    private String phone;
    private String userType;
}
