package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.IngredientStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
public class Ingredients {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Integer ingredientId;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Suppliers supplier;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "unit")
    private String unit;

    @Column(name = "cost_per_unit")
    private Long costPerUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IngredientStatus status = IngredientStatus.Available;

    @Column(name = "minimum_quantity", nullable = false)
    private int minimumQuantity = 1;
}
