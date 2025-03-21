package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"IngredientID", "Supplier_ID"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryID")
    private Integer inventoryId;

    @ManyToOne
    @JoinColumn(name = "IngredientID")
    private Ingredients ingredient;

    @ManyToOne
    @JoinColumn(name = "Supplier_ID")
    private Suppliers supplier;

    @Column(name = "Quantity", precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(name = "Unit")
    private String unit;

    @Column(name = "LastUpdated", nullable = false, updatable = true)
    private LocalDateTime lastUpdated;

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
