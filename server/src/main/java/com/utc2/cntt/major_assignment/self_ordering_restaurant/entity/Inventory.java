package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"IngredientID", "Supplier_ID"}))
@Getter
@Setter
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryID")
    private int inventoryId;

    @ManyToOne
    @JoinColumn(name = "IngredientID", foreignKey = @ForeignKey(name = "fk_inventory_ingredient"))
    private Ingredients ingredient;

    @ManyToOne
    @JoinColumn(name = "Supplier_ID", foreignKey = @ForeignKey(name = "fk_inventory_supplier"))
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
