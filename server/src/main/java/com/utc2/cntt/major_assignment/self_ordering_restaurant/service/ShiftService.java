package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.ShiftRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.ShiftResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Shifts;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService {
    @Autowired
    ShiftRepository shiftRepository;

    public List<ShiftResponseDTO> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(shift -> new ShiftResponseDTO(
                        shift.getShiftId(), shift.getName(), shift.getStartTime(), shift.getEndTime()))
                .collect(Collectors.toList());
    }

    public ShiftResponseDTO getShiftById(Integer shiftId) {
        Shifts shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + shiftId));
        return new ShiftResponseDTO(shift.getShiftId(), shift.getName(), shift.getStartTime(), shift.getEndTime());
    }

    public ShiftResponseDTO createShift(ShiftRequestDTO shiftRequestDTO) {
        Shifts shift = new Shifts();
        shift.setName(shiftRequestDTO.getName());
        shift.setStartTime(shiftRequestDTO.getStartTime());
        shift.setEndTime(shiftRequestDTO.getEndTime());
        shiftRepository.save(shift);
        return new ShiftResponseDTO(shift.getShiftId(), shift.getName(), shift.getStartTime(), shift.getEndTime());
    }

    public ShiftResponseDTO updateShift(Integer shiftId, ShiftRequestDTO shiftRequestDTO) {
        Shifts shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + shiftId));

        shift.setName(shiftRequestDTO.getName());
        shift.setStartTime(shiftRequestDTO.getStartTime());
        shift.setEndTime(shiftRequestDTO.getEndTime());

         shiftRepository.save(shift);
        return new ShiftResponseDTO(shift.getShiftId(), shift.getName(), shift.getStartTime(), shift.getEndTime());
    }

    public void deleteShiftById(Integer shiftId) {
        if (!shiftRepository.existsById(shiftId)) {
            throw new ResourceNotFoundException("Shift not found with id: " + shiftId);
        }
        shiftRepository.deleteById(shiftId);
    }
}
