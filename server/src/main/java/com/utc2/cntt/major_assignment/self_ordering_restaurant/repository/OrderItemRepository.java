package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.OrderItems;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItems, KeyOrderItem> {
    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO(d.name, oi.quantity, oi.notes, d.image) " +
            "FROM OrderItems oi " +
            "JOIN oi.order o " +
            "JOIN oi.dish d " +
            "JOIN o.table t " +
            "WHERE t.tableNumber = :tableNumber " +
            "AND oi.status IN :statuses")
    List<PendingDishItemDTO> findPendingItemsByTableNumber(
            @Param("tableNumber") Integer tableNumber,
            @Param("statuses") List<OrderItemStatus> statuses
    );

    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO(" +
            "d.name, d.image, CAST(SUM(oi.quantity) AS int)) " +
            "FROM OrderItems oi " +
            "JOIN oi.dish d " +
            "JOIN oi.order o " +
            "WHERE oi.status IN :statuses " +
            "GROUP BY d.name, d.image")
    List<PendingDishItemDTO> findPendingOrderItems(@Param("statuses") List<OrderItemStatus> statuses);
}
