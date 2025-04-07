package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.AdminUpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.StaffRequestDTO.UpdateStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Staff;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceExistsException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.StaffRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.ValidationUtils;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    public List<StaffResponseDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::mapToStaffResponseDTO)
                .collect(Collectors.toList());
    }

    public StaffResponseDTO getStaffById(Integer staffId) {
        return staffRepository.findById(staffId)
                .map(this::mapToStaffResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));
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
    public void patchStaff(Integer staffId, UpdateStaffRequestDTO request) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        // Cập nhật username nếu được cung cấp
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            if (!staff.getUser().getUsername().equals(request.getUsername()) &&
                    userRepository.existsByUsername(request.getUsername())) {
                throw new ResourceExistsException("Username already exists");
            }

            if (!ValidationUtils.isValidUsername(request.getUsername())) {
                throw new ValidationException("Invalid username format");
            }

            staff.getUser().setUsername(request.getUsername());
        }

        // Cập nhật fullname nếu được cung cấp
        if (request.getFullname() != null && !request.getFullname().trim().isEmpty()) {
            staff.setFullname(request.getFullname());
        }

        // Cập nhật email nếu được cung cấp
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!staff.getUser().getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                throw new ResourceExistsException("Email already exists");
            }

            if (!ValidationUtils.isValidEmail(request.getEmail())) {
                throw new ValidationException("Invalid email format");
            }

            staff.getUser().setEmail(request.getEmail());
        }

        // Cập nhật phone nếu được cung cấp
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!ValidationUtils.isValidPhone(request.getPhone())) {
                throw new ValidationException("Invalid phone number format");
            }

            staff.getUser().setPhone(request.getPhone());
        }

        // Cập nhật password nếu được cung cấp
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (!ValidationUtils.isPasswordLongEnough(request.getPassword(), 8)) {
                throw new ValidationException("Password must be at least 8 characters");
            }

            if (!ValidationUtils.isStrongPassword(request.getPassword())) {
                throw new ValidationException("Password must include uppercase, lowercase, digit and special character");
            }

            staff.getUser().setPassword(request.getPassword()); // Cân nhắc mã hóa mật khẩu
        }

        // Lưu thông tin user và staff
        userRepository.save(staff.getUser());
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