package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name = "Shifts")
@Getter
@Setter
public class Shifts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Shift_ID")
    private int shiftId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "StartTime", nullable = false)
    private LocalTime startTime;

    @Column(name = "EndTime", nullable = false)
    private LocalTime endTime;

    @OneToMany(mappedBy = "shift")
    private Set<StaffShifts> listStaffShift;
}
