package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderItemRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UpdateOrderStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.OrderResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.*;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyOrderItem;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

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

        // Kiểm tra khách hàng có tồn tại không
        Customers customer = customerRepository.findById(orderRequestDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + orderRequestDTO.getCustomerId()));

        // Kiểm tra bàn có tồn tại không
        Tables table = tableRepository.findById(orderRequestDTO.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + orderRequestDTO.getTableId()));

        // Tạo đơn hàng mới
        Orders order = new Orders();
        order.setCustomer(customer);
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
    }


    // Lấy danh sách đơn hàng
    @Transactional
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderResponseDTO(order.getOrderId(),
                        order.getCustomer().getFullname(),
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
    }

}
