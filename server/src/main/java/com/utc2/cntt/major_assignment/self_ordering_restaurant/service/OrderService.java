package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderItemRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UpdateOrderStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.OrderResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Dishes;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.OrderItems;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Orders;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyOrderItem;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final TableRepository tableRepository;
    private final DishRepository dishRepository;
    private final OrderItemRepository orderItemRepository;
    private final WebSocketService webSocketService;

    private static final String PENDING_DISHES_TOPIC = "/topic/pending-dishes";
    private static final String TABLE_DISHES_TOPIC = "/topic/table-dishes/";

    @Transactional
    public void createOrder(OrderRequestDTO orderRequestDTO) {
        // Kiểm tra đầu vào có null không
        if (orderRequestDTO == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }

        System.out.println("Received OrderRequestDTO: " + orderRequestDTO);

        // Kiểm tra repository đã được inject chưa
        if (customerRepository == null || tableRepository == null || orderRepository == null || dishRepository == null || orderItemRepository == null) {
            throw new IllegalStateException("One or more repositories are not initialized!");
        }

        // Kiểm tra bàn có tồn tại không
        Tables table = tableRepository.findById(orderRequestDTO.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + orderRequestDTO.getTableId()));

        // Tạo đơn hàng mới
        Orders order = new Orders();
        order.setTable(table);
        order.setStatus(OrderStatus.Pending);

        // Lưu đơn hàng vào database
        Orders savedOrder = orderRepository.save(order);
        System.out.println("Created new order with ID: " + savedOrder.getOrderId());

        // Kiểm tra danh sách món ăn có rỗng không
        if (orderRequestDTO.getItems() == null || orderRequestDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // Lưu danh sách OrderItem
        Set<OrderItems> orderItemsList = new HashSet<>();
        for (OrderItemRequestDTO itemDTO : orderRequestDTO.getItems()) {
            Dishes dish = dishRepository.findById(itemDTO.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + itemDTO.getDishId()));

            KeyOrderItem orderItemId = new KeyOrderItem();
            orderItemId.setOrderId(savedOrder.getOrderId());
            orderItemId.setDishId(dish.getDishId());

            OrderItems orderItem = new OrderItems();
            orderItem.setOrderItemId(orderItemId);
            orderItem.setOrder(order);
            orderItem.setDish(dish);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setNotes(itemDTO.getNote());
            orderItem.setUnitPrice(dish.getPrice());

            orderItemsList.add(orderItem);
        }

        // Lưu tất cả order items cùng một lúc
        orderItemRepository.saveAll(orderItemsList);
        System.out.println("Saved " + orderItemsList.size() + " order items.");

        // Trả về kết quả
//        OrderResponseDTO response = new OrderResponseDTO();
//        response.setOrderId(savedOrder.getOrderId());
//        response.setStatus(savedOrder.getStatus());
//
//        return response;

        webSocketService.sendMessage(TABLE_DISHES_TOPIC + orderRequestDTO.getTableId(),
                getPendingItemsForTable(orderRequestDTO.getTableId()));
        webSocketService.sendMessage(PENDING_DISHES_TOPIC, getPendingOrderItems());
    }


    // Lấy danh sách đơn hàng
    @Transactional
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderResponseDTO(order.getOrderId(),
                        order.getTable().getTableNumber(),
                        order.getStatus()))
                .collect(Collectors.toList());
    }

    public void updateOrderStatus(Integer orderId, UpdateOrderStatusDTO updateOrderStatusDTO) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (updateOrderStatusDTO.getStatus() == null) {
            throw new IllegalArgumentException("Status must not be null");
        }

        order.setStatus(updateOrderStatusDTO.getStatus());
        orderRepository.save(order);

        // Gửi WebSocket update
        Integer tableNumber = order.getTable().getTableNumber();
        webSocketService.sendMessage(TABLE_DISHES_TOPIC + tableNumber,
                getPendingItemsForTable(tableNumber));
        webSocketService.sendMessage(PENDING_DISHES_TOPIC, getPendingOrderItems());
    }

    private static final List<OrderItemStatus> PENDING_STATUSES = Arrays.asList(
            OrderItemStatus.Ordered,
            OrderItemStatus.Processing
    );

    @Transactional
    public List<PendingDishItemDTO> getPendingItemsForTable(Integer tableNumber) {
        if (tableNumber == null || tableNumber <= 0) {
            // Có thể throw exception hoặc trả về list rỗng tùy logic mong muốn
            throw new IllegalArgumentException("Table number must be positive.");
            // return Collections.emptyList();
        }
        return orderItemRepository.findPendingItemsByTableNumber(tableNumber, PENDING_STATUSES);
    }

    public List<PendingDishItemDTO> getPendingOrderItems() {
        return orderItemRepository.findPendingOrderItems(PENDING_STATUSES);
    }
}
