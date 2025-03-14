package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "Supplier")
@Getter
@Setter
public class Suppliers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Supplier_ID")
    private int supplyId;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "ContactPerson")
    private String contactPerson;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "Address", columnDefinition = "TEXT")
    private String address;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ingredients> listIngredient;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Inventory> listInventory;
}
