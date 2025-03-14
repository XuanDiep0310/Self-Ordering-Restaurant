package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.IngredientStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "Ingredients")
@Getter
@Setter
public class Ingredients {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Ingredient_ID")
    private int ingredientId;

    @ManyToOne
    @JoinColumn(name = "Supplier_ID", foreignKey = @ForeignKey(name = "fk_ingredient_supplier"))
    private Suppliers supplier;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Unit")
    private String unit;

    @Column(name = "CostPerUnit", precision = 10, scale = 2)
    private BigDecimal costPerUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private IngredientStatus status = IngredientStatus.Available;

    @Column(name = "MinimumQuantity", nullable = false)
    private int minimumQuantity = 1;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DishIngredient> listDishIngredient;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Inventory> listInventory;

}
