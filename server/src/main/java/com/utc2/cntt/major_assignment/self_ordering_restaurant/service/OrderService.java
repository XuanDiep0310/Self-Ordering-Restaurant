package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.lowagie.text.Font;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
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

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
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

    // Java
    public ResponseEntity<byte[]> exportBillPdf(Integer tableNumber) {
        List<BillItemDTO> billItems = getBillForTable(tableNumber);

        Document document = new Document(PageSize.A6, 18, 18, 18, 18); // A6 size, smaller margins
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts for A6: smaller but bold for headers
            Font titleFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font boldFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 9, Font.NORMAL);

            // Title and info
            Paragraph title = new Paragraph("DAILY FOOD", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph address = new Paragraph("Số 450 Lê Văn Việt - TP Thủ Đức, Hồ Chí Minh\nSĐT: 0389379012", normalFont);
            address.setAlignment(Element.ALIGN_CENTER);
            document.add(address);

            document.add(Chunk.NEWLINE);

            Paragraph billTitle = new Paragraph("HOÁ ĐƠN THANH TOÁN", headerFont);
            billTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(billTitle);

            // Use the first orderId if available
            String orderId = billItems.isEmpty() ? "N/A" : String.valueOf(billItems.get(0).getOrderId());
            Paragraph billNo = new Paragraph("Số HĐ: " + orderId, boldFont);
            billNo.setAlignment(Element.ALIGN_CENTER);
            document.add(billNo);

            document.add(Chunk.NEWLINE);

            // Table and time
            Paragraph tableInfo = new Paragraph("Bàn " + tableNumber, boldFont);
            document.add(tableInfo);

            String orderTime = billItems.isEmpty() ? "" : billItems.get(0).getOrderDate().toString();
            Paragraph timeInfo = new Paragraph("Thời gian: " + orderTime, boldFont);
            document.add(timeInfo);

            document.add(Chunk.NEWLINE);

            // Table with 5 columns
            PdfPTable pdfTable = new PdfPTable(new float[]{1, 4, 1, 2, 2});
            pdfTable.setWidthPercentage(100);

            // Table headers
            String[] headers = {"STT", "Tên món", "SL", "Đơn giá", "Thành tiền"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(Color.LIGHT_GRAY);
                pdfTable.addCell(cell);
            }

            // Table rows
            int idx = 1;
            for (BillItemDTO item : billItems) {
                pdfTable.addCell(new PdfPCell(new Phrase(String.valueOf(idx++), normalFont)));
                pdfTable.addCell(new PdfPCell(new Phrase(item.getDishName(), normalFont)));
                pdfTable.addCell(new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont)));
                pdfTable.addCell(new PdfPCell(new Phrase(String.format("%,d", item.getUnitPrice()), normalFont)));
                pdfTable.addCell(new PdfPCell(new Phrase(String.format("%,d", item.getSubTotal()), normalFont)));
            }

            // Fill empty rows if less than 7
            for (int i = billItems.size(); i < 7; i++) {
                for (int j = 0; j < 5; j++) {
                    pdfTable.addCell(new PdfPCell(new Phrase(" ")));
                }
            }

            document.add(pdfTable);

            document.add(Chunk.NEWLINE);

            // Total
            long total = billItems.isEmpty() ? 0 : billItems.get(0).getTotalAmount();
            Paragraph totalLine = new Paragraph("Tổng tiền: " + String.format("%,d", total) + "đ", boldFont);
            totalLine.setAlignment(Element.ALIGN_LEFT);
            document.add(totalLine);

            document.add(Chunk.NEWLINE);
            document.add(new LineSeparator());

            // Thank you
            Paragraph thanks = new Paragraph("Cảm ơn Quý khách !", headerFont);
            thanks.setAlignment(Element.ALIGN_CENTER);
            document.add(thanks);

            document.close();

            HttpHeaders headersHttp = new HttpHeaders();
            headersHttp.setContentType(MediaType.APPLICATION_PDF);
            headersHttp.setContentDispositionFormData("attachment", "bill_table_" + tableNumber + ".pdf");

            return ResponseEntity.ok()
                    .headers(headersHttp)
                    .body(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
