package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.config.VNPayConfig;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.TableRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.BillItemDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.HistoryBillDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Orders;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Payments;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentMethod;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentOrderStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.PaymentStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.OrderRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PaymentService {
    final Logger log = LoggerFactory.getLogger(PaymentService.class);
    final OrderRepository orderRepository;
    final PaymentRepository paymentRepository;
    final TableService tableService;

    @Transactional
    public String createOrder(int total, String orderInfo, String urlReturn) throws Exception {
        // Parse the order ID from orderInfo
        Integer orderId = extractOrderIdFromOrderInfo(orderInfo);

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";

        // Create a pending payment record in database
        if (orderId != null) {
            Orders order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

            Payments payment = new Payments();
            payment.setOrder(order);
            payment.setCustomer(order.getCustomer());
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod(PaymentMethod.Online);
            payment.setStatus(PaymentStatus.Pending);
            payment.setTransactionId(vnp_TxnRef);
            payment.setPaymentDate(LocalDateTime.now());

            paymentRepository.save(payment);

            log.info("Created pending payment record with transaction ID: {}", vnp_TxnRef);
        }

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(total * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);

        String vnp_OrderInfo = new String(orderInfo.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);

        vnp_Params.put("vnp_OrderType", orderType);
        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                query.append('&');
                hashData.append('&');
            }
        }
        query.setLength(query.length() - 1); // Remove last &
        hashData.setLength(hashData.length() - 1);

        // Hash data for security
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return VNPayConfig.vnp_PayUrl + "?" + query;
    }

    private Integer extractOrderIdFromOrderInfo(String orderInfo) {
        try {
            // Assuming order info is in format "Payment for Order: {orderId}"
            if (orderInfo != null && orderInfo.contains("Order:")) {
                String orderIdStr = orderInfo.substring(orderInfo.indexOf("Order:") + 7).trim();
                return Integer.parseInt(orderIdStr);
            }
        } catch (Exception e) {
            log.error("Error extracting order ID from order info: {}", e.getMessage());
        }
        return null;
    }

    @Transactional
    public Map<String, Object> orderReturn(Map<String, String> queryParams) throws Exception {
        Map<String, Object> result = new HashMap<>();
        result.put("status", -1);
        result.put("transactionStatus", "FAILED");
        result.put("responseCode", null);
        result.put("message", "Giao dịch thất bại!");

        try {
            // Extensive logging for all parameters
            log.info("Raw VNPay Callback Params: {}",
                    queryParams.entrySet().stream()
                            .map(e -> e.getKey() + "=" + e.getValue())
                            .collect(Collectors.joining(", ")));

            // Create a copy of parameters for hash verification
            Map<String, String> fields = new HashMap<>(queryParams);

            // Extract and remove secure hash for verification
            String vnp_SecureHash = fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            // Prepare parameters for hash calculation
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            for (int i = 0; i < fieldNames.size(); i++) {
                String fieldName = fieldNames.get(i);
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName)
                            .append("=")
                            .append(fieldValue);
                    if (i < fieldNames.size() - 1) {
                        hashData.append("&");
                    }
                }
            }

            // Logging hash calculation details
            log.info("Hash Calculation String: {}", hashData.toString());

            // Calculate hash - CRITICAL PART
            String calculatedHash = VNPayConfig.hmacSHA512(
                    VNPayConfig.vnp_HashSecret,
                    hashData.toString()
            );

            log.info("Original SecureHash: {}", vnp_SecureHash);
            log.info("Calculated SecureHash: {}", calculatedHash);
            log.info("Hash Comparison: {}", calculatedHash.equalsIgnoreCase(vnp_SecureHash));

            // Signature verification
            if (calculatedHash.equalsIgnoreCase(vnp_SecureHash)) {
                String txnRef = queryParams.get("vnp_TxnRef");
                String amount = queryParams.get("vnp_Amount");

                // Find payment record
                Payments payment = paymentRepository.findByTransactionId(txnRef);

                if (payment == null) {
                    log.error("No payment found for transaction ID: {}", txnRef);
                    return result;
                }

                // More robust verification
                boolean isSuccessful =
                        payment.getAmount() == Long.parseLong(amount)/100 &&
                                // Additional checks can be added here
                                txnRef.equals(payment.getTransactionId());

                // Update payment status
                payment.setStatus(isSuccessful ? PaymentStatus.Success : PaymentStatus.Failed);
                paymentRepository.save(payment);

                // Update order if payment is successful
                if (isSuccessful && payment.getOrder() != null) {
                    Orders order = payment.getOrder();
                    order.setPaymentStatus(PaymentOrderStatus.Paid);
                    // Update table status to Available
                    if (order.getTable() != null) {
                        order.getTable().setStatus(com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus.Available);
                    }
                    orderRepository.save(order);
                    log.info("Order {} payment status updated to PAID and table status updated to Available", order.getOrderId());
                }

                // Prepare result
                result.put("status", isSuccessful ? 1 : 0);
                result.put("transactionStatus", isSuccessful ? "SUCCESS" : "FAILED");
                result.put("responseCode", "00");
                result.put("message", isSuccessful
                        ? "Thanh toán thành công!"
                        : "Giao dịch thất bại!");

                log.info("Final Payment Status for transaction {}: {}",
                        txnRef, result.get("transactionStatus"));
            } else {
                log.error("Signature verification FAILED for transaction");
            }

            return result;
        } catch (Exception e) {
            log.error("Comprehensive Error in VNPay Response Processing", e);
            return result;
        }
    }

    @Transactional
    public void createCashPayment(int orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        if (order.getPaymentStatus() == PaymentOrderStatus.Paid) {
            log.warn("Order ID {} has already been paid. No new payment record created.", orderId);
            return;
        }

        Payments payment = new Payments();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(PaymentMethod.Cash);
        payment.setStatus(PaymentStatus.Success);
        String uniqueTransactionId = "Cash-" + UUID.randomUUID();
        payment.setTransactionId(uniqueTransactionId);
        payment.setPaymentDate(LocalDateTime.now());

        paymentRepository.save(payment);

        if (order.getTable() != null) {
            tableService.updateTableStatus(order.getTable().getTableNumber(), new TableRequestDTO(TableStatus.Available));
        }
        order.setPaymentStatus(PaymentOrderStatus.Paid);
        orderRepository.save(order);

        log.info("Created cash payment record for order ID: {}", orderId);
    }

    @Transactional(readOnly = true)
    public List<HistoryBillDTO> getPaymentHistory() {
        return paymentRepository.getPaymentHistory().stream()
                .map(record -> new HistoryBillDTO(
                        record.getOrderId(),
                        record.getTableNumber(),
                        record.getAmount(),
                        record.getPaymentMethod(),
                        record.getPaymentDate(),
                        record.getDishName(),
                        record.getQuantity(),
                        record.getUnitPrice(),
                        record.getSubTotal()
                ))
                .collect(Collectors.toList());
    }

    public ResponseEntity<byte[]> exportHistoryBillPdf(Integer orderId) {
        List<BillItemDTO> billItems = paymentRepository.getBillByOrderId(orderId);

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

            Paragraph billNo = new Paragraph("Số HĐ: " + orderId, boldFont);
            billNo.setAlignment(Element.ALIGN_CENTER);
            document.add(billNo);

            document.add(Chunk.NEWLINE);

            // Table and time
            Paragraph tableInfo = new Paragraph("Bàn " + billItems.get(0).getTableNumber(), boldFont);
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
            headersHttp.setContentDispositionFormData("attachment", "bill_table_" + billItems.get(0).getTableNumber() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headersHttp)
                    .body(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}