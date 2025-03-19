package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentMethod;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Getter
@Setter
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Payment_ID")
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "Order_ID", nullable = false)
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "Customer_ID")
    private Customers customer;

    @Column(name = "Amount", nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentMethod")
    private PaymentMethod paymentMethod;

    @Column(name = "PaymentDate")
    private LocalDateTime paymentDate;

    @Column(name = "TransactionID", unique = true)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private PaymentStatus status;
}
