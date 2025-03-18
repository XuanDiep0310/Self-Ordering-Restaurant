package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.StaffStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "staff")
@Getter
@Setter
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Staff_ID")
    private int staffId;

    @OneToOne
    @JoinColumn(name = "User_ID", nullable = false, unique = true)
    private Users user;

    @Column(name = "Fullname", nullable = false)
    private String fullname;

    @Column(name = "Position")
    private String position;

    @Column(name = "Salary", precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "HireDate")
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private StaffStatus status;

    @OneToMany(mappedBy = "staff")
    private Set<StaffShifts> listStaffShift;

    @OneToMany(mappedBy = "staff")
    private Set<Orders> listOrder;
}
