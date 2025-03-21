package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "Orders")
@Getter
@Setter
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Order_ID")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "Staff_ID")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "TableNumber")
    private Tables table;

    @ManyToOne
    @JoinColumn(name = "Customer_ID")
    private Customers customer;

    @Column(name = "OrderDate")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private OrderStatus status = OrderStatus.Pending;

    @Column(name = "TotalAmount", nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "Discount")
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "Notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentStatus", nullable = false)
    private PaymentOrderStatus paymentStatus = PaymentOrderStatus.Unpaid;
}
