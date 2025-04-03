package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.UserResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserServiceImpl {

    @Autowired
    UserRepository userRepository;

    @Override
    public List<UserResponseDTO> getAllUser() {
        List<UserResponseDTO> listUserResponseDTO = userRepository.findAll().stream()
                .map(users -> new UserResponseDTO(
                        users.getUserId(),
                        users.getUsername(),
                        users.getPassword(),
                        users.getPhone(),
                        users.getEmail()
                ))
                .toList();
        return listUserResponseDTO;
    }
}
