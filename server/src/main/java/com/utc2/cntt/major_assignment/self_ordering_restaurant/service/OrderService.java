package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderItemRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.OrderRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UpdateOrderStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.BillItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.OrderResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PendingDishItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Dishes;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.OrderItems;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Orders;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderItemStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.OrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.key.KeyOrderItem;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final TableRepository tableRepository;
    private final DishRepository dishRepository;
    private final OrderItemRepository orderItemRepository;
        private final TableService tableService;
    private final WebSocketService webSocketService;

    private static final String PENDING_DISHES_TOPIC = "/topic/pending-dishes";
    private static final String TABLE_DISHES_TOPIC = "/topic/table-dishes/";
    private static final String TABLES_TOPIC = "/topic/tables";

    @Transactional
    public void createOrder(OrderRequestDTO orderRequestDTO) {
        if (orderRequestDTO == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }

        Tables table = tableRepository.findById(orderRequestDTO.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + orderRequestDTO.getTableId()));

        // Find existing unpaid order for the table
        Orders order = orderRepository.findFirstByTableAndPaymentStatusOrderByOrderIdDesc(
                        table, PaymentOrderStatus.Unpaid)
                .orElseGet(() -> {
                    // Create new order if none exists
                    Orders newOrder = new Orders();
                    newOrder.setTable(table);
                    newOrder.setStatus(OrderStatus.Pending);
                    newOrder.setPaymentStatus(PaymentOrderStatus.Unpaid);
                    newOrder.setOrderDate(LocalDateTime.now());
                    return orderRepository.save(newOrder);
                });

        if (orderRequestDTO.getItems() == null || orderRequestDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        Long additionalTotal = 0L;
        // Process new items
        for (OrderItemRequestDTO itemDTO : orderRequestDTO.getItems()) {
            Dishes dish = dishRepository.findById(itemDTO.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + itemDTO.getDishId()));

            KeyOrderItem orderItemId = new KeyOrderItem();
            orderItemId.setOrderId(order.getOrderId());
            orderItemId.setDishId(dish.getDishId());

            OrderItems existingItem = orderItemRepository.findByOrderItemId(orderItemId);

            if (existingItem != null) {
                // Update existing item quantity
                existingItem.setQuantity(existingItem.getQuantity() + itemDTO.getQuantity());
                existingItem.setNotes(itemDTO.getNote());
                orderItemRepository.save(existingItem);
                additionalTotal += dish.getPrice() * itemDTO.getQuantity();
            } else {
                // Create new order item
                OrderItems newOrderItem = new OrderItems();
                newOrderItem.setOrderItemId(orderItemId);
                newOrderItem.setOrder(order);
                newOrderItem.setDish(dish);
                newOrderItem.setQuantity(itemDTO.getQuantity());
                newOrderItem.setNotes(itemDTO.getNote());
                newOrderItem.setUnitPrice(dish.getPrice());
                newOrderItem.setStatus(OrderItemStatus.Ordered);
                orderItemRepository.save(newOrderItem);
                additionalTotal += dish.getPrice() * itemDTO.getQuantity();
            }
        }

        // Update total amount
        order.setTotalAmount(order.getTotalAmount() + additionalTotal);
        orderRepository.save(order);

        // Send WebSocket updates
        webSocketService.sendMessage(TABLE_DISHES_TOPIC + table.getTableNumber(),
                getPendingItemsForTable(table.getTableNumber()));
        webSocketService.sendMessage(PENDING_DISHES_TOPIC, getPendingOrderItems());
        webSocketService.sendMessage(TABLES_TOPIC, tableService.getAllTables());
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
            throw new IllegalArgumentException("Table number must be positive.");
            // return Collections.emptyList();
        }
        return orderItemRepository.findPendingItemsByTableNumber(tableNumber, PENDING_STATUSES);
    }

    public List<PendingDishItemDTO> getPendingOrderItems() {
        return orderItemRepository.findPendingOrderItems(PENDING_STATUSES);
    }

    public List<BillItemDTO> getBillForTable(Integer tableNumber) {
        return orderItemRepository.getBillForTable(tableNumber);
    }

    public ResponseEntity<byte[]> exportBillPdf(Integer tableNumber) {
        List<BillItemDTO> billItems = getBillForTable(tableNumber);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Restaurant Bill"));
            document.add(new Paragraph("Table Number: " + tableNumber));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.addCell("Dish");
            table.addCell("Quantity");
            table.addCell("Unit Price");
            table.addCell("Subtotal");
            table.addCell("Order Date");

            for (BillItemDTO item : billItems) {
                table.addCell(item.getDishName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(String.valueOf(item.getUnitPrice()));
                table.addCell(String.valueOf(item.getSubTotal()));
                table.addCell(item.getOrderDate().toString());
            }

            // Add total
            if (!billItems.isEmpty()) {
                table.addCell("");
                table.addCell("");
                table.addCell("");
                table.addCell("Total:");
                table.addCell(String.valueOf(billItems.get(0).getTotalAmount()));
            }

            document.add(table);
            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "bill_table_" + tableNumber + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
