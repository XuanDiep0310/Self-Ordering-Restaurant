package com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.LoginRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.LoginResponseDTO;

public interface AuthServiceImpl {
    LoginResponseDTO login(LoginRequestDTO loginRequest);
    void logout();
}
