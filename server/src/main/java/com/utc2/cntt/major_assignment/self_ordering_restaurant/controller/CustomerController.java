package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.CustomerRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.CustomerResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomer() {
        return ResponseEntity.ok(customerService.getAllCustomer());
    }

    @GetMapping("/{customer_id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable("customer_id") Integer customerId) {
        return ResponseEntity.ok(customerService.getCustomerById(customerId));
    }

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> createCustomer(@RequestBody CustomerRequestDTO customerRequestDTO) {
        return ResponseEntity.ok(customerService.createCustomer(customerRequestDTO));
    }

    @PutMapping("/{customer_id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable("customer_id") Integer customerId, @RequestBody CustomerRequestDTO customerRequestDTO) {
        return ResponseEntity.ok(customerService.updateCustomer(customerId, customerRequestDTO));
    }

    @DeleteMapping("/{customer_id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable("customer_id") Integer customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.ok("Customer deleted successfully!");
    }
}
