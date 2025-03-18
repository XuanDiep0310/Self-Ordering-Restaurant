package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyDishIngredient;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "DishIngredient")
@Getter
@Setter
public class DishIngredient {
    @EmbeddedId
    private KeyDishIngredient dishIngredientId;

    @ManyToOne
    @MapsId("dishId") // Map với khóa chính của KeyDishIngredient
    @JoinColumn(name = "Dish_ID")
    private Dishes dish;

    @ManyToOne
    @MapsId("ingredientId") // Map với khóa chính của KeyDishIngredient
    @JoinColumn(name = "Ingredient_ID")
    private Ingredients ingredient;

    @Column(name = "Quantity", precision = 10, scale = 2, nullable = false)
    private BigDecimal quantity;
}
