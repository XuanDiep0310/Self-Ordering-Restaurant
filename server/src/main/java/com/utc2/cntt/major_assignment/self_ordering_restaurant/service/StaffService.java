package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.AssignStaffRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.StaffResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Shifts;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Staff;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.StaffShifts;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.ShiftStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.ShiftRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.StaffRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.StaffShiftRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {
    @Autowired
    StaffRepository staffRepository;

    @Transactional
    public List<StaffResponseDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(staff -> new StaffResponseDTO(
                        staff.getStaffId(),
                        staff.getFullname(),
                        staff.getPosition()
                ))
                .collect(Collectors.toList());
    }
}
