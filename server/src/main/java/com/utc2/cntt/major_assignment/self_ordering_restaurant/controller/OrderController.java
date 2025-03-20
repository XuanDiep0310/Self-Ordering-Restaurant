package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UpdateOrderStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.OrderResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        orderService.createOrder(orderRequestDTO);
        return ResponseEntity.ok("Create order successfully!");
    }

    @GetMapping
    public List<OrderResponseDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{order_id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable("order_id") Integer orderId, @RequestBody UpdateOrderStatusDTO updateOrderStatusDTO) {
        orderService.updateOrderStatus(orderId, updateOrderStatusDTO);
        return ResponseEntity.ok("Order status updated successfully!");
    }
}
