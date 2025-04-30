package com.utc2.cntt.major_assignment.self_ordering_restaurant.repository;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Orders;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    Optional<Orders> findFirstByTableAndPaymentStatusOrderByOrderIdDesc(
            Tables table,
            PaymentOrderStatus paymentStatus
    );
}
