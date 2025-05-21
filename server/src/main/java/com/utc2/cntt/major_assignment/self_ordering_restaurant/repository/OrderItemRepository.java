package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.BillItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.OrderItems;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItems, Integer> {
    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO(" +
            "oi.orderItemId, d.name, oi.quantity, oi.notes, d.image, oi.status) " +
            "FROM OrderItems oi " +
            "JOIN oi.order o " +
            "JOIN oi.dish d " +
            "JOIN o.table t " +
            "WHERE t.tableNumber = :tableNumber " +
            "AND o.paymentStatus = com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus.Unpaid")
    List<PendingDishItemDTO> findPendingItemsByTableNumber(
            @Param("tableNumber") Integer tableNumber
    );

    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO(" +
            "oi.orderItemId, d.name, CAST(SUM(oi.quantity) AS int), oi.notes, d.image, oi.status) " +
            "FROM OrderItems oi " +
            "JOIN oi.dish d " +
            "JOIN oi.order o " +
            "WHERE oi.status IN :statuses " +
            "AND o.paymentStatus = com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus.Unpaid " +
            "GROUP BY oi.orderItemId, d.name, d.image, oi.notes, oi.status")
    List<PendingDishItemDTO> findPendingOrderItems(@Param("statuses") List<OrderItemStatus> statuses);

    OrderItems findByOrderItemId(Integer orderItemId);

    // src/main/java/com/utc2/cntt/major_assignment/self_ordering_restaurant/repository/OrderItemRepository.java
    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.BillItemDTO(" +
            "o.table.tableNumber, o.orderId, d.name, d.image, oi.quantity, d.price, (oi.quantity * d.price), o.totalAmount, o.orderDate) " +
            "FROM OrderItems oi " +
            "JOIN oi.order o " +
            "JOIN oi.dish d " +
            "WHERE o.table.tableNumber = :tableNumber AND o.paymentStatus = com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus.Unpaid")
    List<BillItemDTO> getBillForTable(@Param("tableNumber") Integer tableNumber);
}
