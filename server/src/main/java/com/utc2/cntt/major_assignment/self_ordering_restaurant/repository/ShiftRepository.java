package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Shifts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftRepository extends JpaRepository<Shifts, Integer> {
}
