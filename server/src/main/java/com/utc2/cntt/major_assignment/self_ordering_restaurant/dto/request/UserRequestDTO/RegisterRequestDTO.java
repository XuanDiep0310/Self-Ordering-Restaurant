package com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UserRequestDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Full name is required")
    private String fullname;

    private String position;

    private Long salary;
}
