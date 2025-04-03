package com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.UserResponseDTO;

import java.util.List;

public interface UserServiceImpl {
    List<UserResponseDTO> getAllUser();
}
