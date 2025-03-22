package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "Suppliers")
@Getter
@Setter
public class Suppliers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Supplier_ID")
    private Integer supplierId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "ContactPerson")
    private String contactPerson;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "Address")
    private String address;
}
