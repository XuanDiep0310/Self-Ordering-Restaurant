package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findByIngredientNameContainingIgnoreCase(String name);

    @Query("SELECT i FROM Inventory i WHERE i.ingredient.ingredientId = :ingredientId AND i.supplier.supplierId = :supplierId")
    Inventory findByIngredientIdAndSupplierId(@Param("ingredientId") Integer ingredientId, @Param("supplierId") Integer supplierId);
}
