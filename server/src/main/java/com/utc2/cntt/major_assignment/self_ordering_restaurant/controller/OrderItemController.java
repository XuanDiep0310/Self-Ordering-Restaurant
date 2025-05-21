package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderItemStatusRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.IOrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {
    private final IOrderItemService orderItemService;

    @PutMapping("/update-status/{orderItemId}")
    public ResponseEntity<String> updateOrderItemStatus(@PathVariable Integer orderItemId, @RequestBody OrderItemStatusRequestDTO request) {
        try {
            orderItemService.updateOrderItemStatus(orderItemId, request.getStatus());
            return ResponseEntity.ok("Order item status updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
