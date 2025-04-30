package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UpdateOrderStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.BillItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.OrderResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

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

    @GetMapping("/pending-items/{tableNumber}")
    public ResponseEntity<List<PendingDishItemDTO>> getPendingItemsForTable(@PathVariable Integer tableNumber) {
        try {
            List<PendingDishItemDTO> pendingItems = orderService.getPendingItemsForTable(tableNumber);
            if (pendingItems.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(pendingItems);
        } catch (IllegalArgumentException e) {
            // Nếu service throw IllegalArgumentException (ví dụ: số bàn không hợp lệ)
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/pending-items")
    public ResponseEntity<List<PendingDishItemDTO>> getPendingOrderItems() {
        List<PendingDishItemDTO> pendingItems = orderService.getPendingOrderItems();
        return new ResponseEntity<>(pendingItems, HttpStatus.OK);
    }

    @GetMapping("/bill/{tableNumber}")
    public ResponseEntity<List<BillItemDTO>> getBill(@PathVariable Integer tableNumber) {
        List<BillItemDTO> bill = orderService.getBillForTable(tableNumber);
        return ResponseEntity.ok(bill);
    }
}
