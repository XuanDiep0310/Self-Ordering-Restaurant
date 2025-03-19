package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "Tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TableNumber")
    private Integer tableNumber;

    @Column(name = "Capacity", nullable = false)
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private TableStatus status = TableStatus.Available;

    @Column(name = "Location")
    private String location;

    @Column(name = "QRCode")
    private String qrCode;

    @OneToMany(mappedBy = "table")
    private Set<Orders> listOrder;
}
