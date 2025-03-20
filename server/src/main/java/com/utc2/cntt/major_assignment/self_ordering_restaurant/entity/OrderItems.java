package com.utc2.cntt.major_assignment.self_ordering_restaurant.entity;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyOrderItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "OrderItems")
@Getter
@Setter
public class OrderItems {
    @EmbeddedId
    private KeyOrderItem orderItemId;  // Composite Key

    @ManyToOne
    @MapsId("orderId") // Mapping với Order_ID trong composite key
    @JoinColumn(name = "Order_ID")
    private Orders order;

    @ManyToOne
    @MapsId("dishId") // Mapping với Dish_ID trong composite key
    @JoinColumn(name = "Dish_ID")
    private Dishes dish;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "UnitPrice", nullable = false)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "Notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private OrderItemStatus status = OrderItemStatus.Ordered;

    @Column(name = "SubTotal", insertable = false, updatable = false)
    private BigDecimal subTotal; // Được tính tự động bởi database
}
