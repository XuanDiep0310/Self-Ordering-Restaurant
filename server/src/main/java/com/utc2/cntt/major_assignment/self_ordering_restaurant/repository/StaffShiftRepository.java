package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Shifts;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Staff;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.StaffShifts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface StaffShiftRepository extends JpaRepository<StaffShifts, Integer> {
    boolean existsByStaffAndShiftAndDate(Staff staff, Shifts shift, LocalDate date);
}
