package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.AdminUpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.UpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Staff;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Users;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceExistsException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.StaffRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.ValidationUtils;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<StaffResponseDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::mapToStaffResponseDTO)
                .collect(Collectors.toList());
    }

    public StaffResponseDTO getStaffById(Integer staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));
        return mapToStaffResponseDTO(staff);
    }

    public StaffResponseDTO getStaffByUsername(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Staff staff = staffRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found for user with username: " + username));

        return mapToStaffResponseDTO(staff);
    }

    @Transactional
    public void adminUpdateStaff(Integer staffId, AdminUpdateStaffRequestDTO request) {
        validateAdminUpdateRequest(request);

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        staff.setPosition(request.getPosition());
        staff.setSalary(request.getSalary());
        staffRepository.save(staff);
    }

    @Transactional
    public void patchStaffByUsername(String username, UpdateStaffRequestDTO request) {
        // Find user by username
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Find staff associated with the user
        Staff staff = staffRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found for user with username: " + username));

        // Username is now fixed and cannot be changed
        // Removed the username update logic

        // Update fullname if provided
        if (request.getFullname() != null && !request.getFullname().trim().isEmpty()) {
            staff.setFullname(request.getFullname());
        }

        // Update email if provided
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!user.getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                throw new ResourceExistsException("Email already exists");
            }

            if (!ValidationUtils.isValidEmail(request.getEmail())) {
                throw new ValidationException("Invalid email format");
            }

            user.setEmail(request.getEmail());
        }

        // Update phone if provided
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!ValidationUtils.isValidPhone(request.getPhone())) {
                throw new ValidationException("Invalid phone number format");
            }

            user.setPhone(request.getPhone());
        }

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (!ValidationUtils.isPasswordLongEnough(request.getPassword(), 8)) {
                throw new ValidationException("Password must be at least 8 characters");
            }

            if (!ValidationUtils.isStrongPassword(request.getPassword())) {
                throw new ValidationException("Password must include uppercase, lowercase, digit and special character");
            }

            // Consider encrypting the password before saving
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Save user and staff information
        userRepository.save(user);
        staffRepository.save(staff);
    }

    @Transactional
    public void deleteStaff(Integer staffId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));
        staff.getUser().setStatus(UserStatus.Inactive);
        staffRepository.delete(staff);
    }

    private StaffResponseDTO mapToStaffResponseDTO(Staff staff) {
        return new StaffResponseDTO(
                staff.getStaffId(),
                staff.getFullname(),
                staff.getUser().getEmail(),
                staff.getUser().getPhone(),
                staff.getPosition(),
                staff.getSalary().toString()
        );
    }

    private void validateAdminUpdateRequest(AdminUpdateStaffRequestDTO request) {
        if (request.getPosition() == null || request.getPosition().trim().isEmpty()) {
            throw new ValidationException("Position is required");
        }

        if (request.getSalary() == null || request.getSalary() <= 0) {
            throw new ValidationException("Salary must be positive");
        }
    }

    private void validateStaffUpdateRequest(UpdateStaffRequestDTO request) {
        if (!ValidationUtils.isValidUsername(request.getUsername())) {
            throw new ValidationException("Invalid username format");
        }

        if (!ValidationUtils.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (!ValidationUtils.isValidPhone(request.getPhone())) {
            throw new ValidationException("Invalid phone number format");
        }

        // Only validate password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!ValidationUtils.isPasswordLongEnough(request.getPassword(), 8)) {
                throw new ValidationException("Password must be at least 8 characters");
            }

            if (!ValidationUtils.isStrongPassword(request.getPassword())) {
                throw new ValidationException("Password must include uppercase, lowercase, digit and special character");
            }
        }
    }
}