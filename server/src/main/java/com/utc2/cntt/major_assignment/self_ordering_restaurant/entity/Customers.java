package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Customers")
@Getter
@Setter
public class Customers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Customer_ID")
    private int customerId;

    @OneToOne
    @JoinColumn(name = "User_ID", nullable = false)
    private Users user;

    @Column(name = "Fullname", nullable = false)
    private String fullname;

    @Column(name = "JoinDate")
    private LocalDateTime joinDate;

    @Column(name = "Points", nullable = false)
    private int points;

    @OneToMany(mappedBy = "customer")
    private Set<Orders> listOrder;

    @OneToMany(mappedBy = "customer")
    private Set<Payments> listPayment;

    @OneToMany(mappedBy = "customer")
    private Set<CustomerFeedback> listFeedback;

}
