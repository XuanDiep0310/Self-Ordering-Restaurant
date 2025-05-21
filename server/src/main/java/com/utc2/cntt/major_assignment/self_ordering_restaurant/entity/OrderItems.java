package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dishes dish;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private Long unitPrice = 0L;

    @Column(name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderItemStatus status = OrderItemStatus.Ordered;

    @Column(name = "sub_total", insertable = false, updatable = false)
    private BigDecimal subTotal; // Được tính tự động bởi database
}
