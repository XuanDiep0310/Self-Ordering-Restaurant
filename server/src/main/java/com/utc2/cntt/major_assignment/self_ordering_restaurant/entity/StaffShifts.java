package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "StaffShifts")
@Getter
@Setter
public class StaffShifts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "Staff_ID", nullable = false)
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "Shift_ID", nullable = false)
    private Shifts shift;

    @Column(name = "Date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private ShiftStatus status;
}
