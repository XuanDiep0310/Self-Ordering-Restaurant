package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.HistoryBillDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payments, Integer> {
    Payments findByTransactionId(String transactionId);

    @Query("SELECT new com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.HistoryBillDTO(" +
            "p.order.orderId, o.table.tableNumber, p.amount, p.paymentMethod, p.paymentDate, d.name, " +
            "CAST(SUM(oi.quantity) AS long), oi.unitPrice, CAST(SUM(oi.subTotal) AS long)) " +
            "FROM Payments p " +
            "JOIN p.order o ON p.order.orderId = o.orderId " +
            "JOIN OrderItems oi ON p.order.orderId = oi.order.orderId " +
            "JOIN Dishes d ON oi.dish.dishId = d.dishId " +
            "GROUP BY p.order.orderId, o.table.tableNumber, p.amount, p.paymentMethod, p.paymentDate, d.name, oi.unitPrice " +
            "ORDER BY p.paymentDate DESC")
    List<HistoryBillDTO> getPaymentHistory();

}
