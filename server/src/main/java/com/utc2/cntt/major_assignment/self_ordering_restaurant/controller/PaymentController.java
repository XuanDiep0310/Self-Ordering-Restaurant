package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.PaymentRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.BillResponseDTO.HistoryBillDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.PaymentResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO request, HttpServletRequest httpRequest) {
        try {
//            log.info("🔹 Creating VNPay Payment: {}", request);

            // Make sure orderInfo contains order ID for reference
            if (!request.getOrderInfo().contains("Order:")) {
                request.setOrderInfo("Payment for Order: " + request.getOrderId());
            }

            String paymentUrl = paymentService.createOrder(request.getTotal(), request.getOrderInfo(), request.getReturnUrl());

            return ResponseEntity.ok(PaymentResponseDTO.builder()
                    .paymentUrl(paymentUrl)
                    .message("VNPay payment URL generated successfully.")
                    .build());
        } catch (Exception e) {
            log.error("Error creating payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi tạo thanh toán: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay_payment")
    public ResponseEntity<?> handleVNPayReturn(HttpServletRequest request) {
        try {
            String queryString = request.getQueryString();
            log.info("🔹 Original query string: {}", queryString);

            // Parse query string without decoding to preserve encoded values
            Map<String, String> params = parseQueryString(queryString);
            log.info("🔹 Parsed params: {}", params);

            Map<String, Object> result = paymentService.orderReturn(params);
            int status = (int) result.get("status");
            String transactionStatus = (String) result.get("transactionStatus");
            String responseCode = (String) result.get("responseCode");

            log.info("🔹 Payment Result - Status: {}, Transaction Status: {}, Response Code: {}",
                    status, transactionStatus, responseCode);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("transactionStatus", transactionStatus);
            responseBody.put("responseCode", responseCode);

            if (status == 1) {
                responseBody.put("message", "Thanh toán thành công!");
                return ResponseEntity.ok(responseBody);
            } else if (status == 0) {
                responseBody.put("message", "Giao dịch thất bại!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
            } else {
                responseBody.put("message", "Sai chữ ký hoặc giao dịch bị thay đổi!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý VNPay: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi xử lý VNPay: " + e.getMessage());
        }
    }

    private Map<String, String> parseQueryString(String queryString) {
        Map<String, String> result = new HashMap<>();
        if (queryString == null || queryString.isEmpty()) {
            return result;
        }

        String[] pairs = queryString.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = pair.substring(0, idx);
                String value = idx < pair.length() - 1 ? pair.substring(idx + 1) : "";
                // DO NOT decode values - this is critical
                result.put(key, value);
            }
        }
        return result;
    }

    @PostMapping("/cash/{orderId}")
    public ResponseEntity<?> createCashPayment(@PathVariable int orderId) {
        try {
            paymentService.createCashPayment(orderId);
            return ResponseEntity.ok("Cash payment processed successfully for Order ID: " + orderId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing cash payment: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<HistoryBillDTO>> getPaymentHistory() {
        List<HistoryBillDTO> paymentHistory = paymentService.getPaymentHistory();
        return ResponseEntity.ok(paymentHistory);
    }

    @GetMapping("/bill/history/{orderId}/pdf")
    public ResponseEntity<byte[]> exportBillPdf(@PathVariable Integer orderId) {
        return paymentService.exportHistoryBillPdf(orderId);
    }
}

