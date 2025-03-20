package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.AssignStaffRequestDTO;
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

@Service
public class StaffShiftService {
    @Autowired
    StaffRepository staffRepository;

    @Autowired
    ShiftRepository shiftRepository;

    @Autowired
    StaffShiftRepository staffShiftRepository;

    @Transactional
    public void assignStaffToShift(@RequestBody AssignStaffRequestDTO staffShiftRequestDTO) {
        Staff staff = staffRepository.findById(staffShiftRequestDTO.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffShiftRequestDTO.getStaffId()));

        Shifts shift = shiftRepository.findById(staffShiftRequestDTO.getShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + staffShiftRequestDTO.getShiftId()));

        if(staffShiftRepository.existsByStaffAndShiftAndDate(staff, shift, staffShiftRequestDTO.getDate())) {
            throw new RuntimeException("Staff is already assigned to this shift on " + staffShiftRequestDTO.getDate());
        }

        StaffShifts staffShifts = new StaffShifts();
        staffShifts.setStaff(staff);
        staffShifts.setShift(shift);
        staffShifts.setDate(staffShiftRequestDTO.getDate());
        staffShifts.setStatus(ShiftStatus.Assigned);

        staffShiftRepository.save(staffShifts);
    }
}
