package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.SupplierRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.SupplierResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    @Autowired
    SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SupplierResponseDTO>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{supplier_id}")
    public ResponseEntity<SupplierResponseDTO> getSupplierById(@PathVariable("supplier_id") Integer supplierId) {
        return ResponseEntity.ok(supplierService.getSupplierById(supplierId));
    }

    @PostMapping
    public ResponseEntity<SupplierResponseDTO> createSupplier(@RequestBody SupplierRequestDTO supplierRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.createSupplier(supplierRequestDTO));
    }

    @PutMapping("/{supplier_id}")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(
            @PathVariable("supplier_id") Integer supplierId,
            @RequestBody SupplierRequestDTO supplierRequestDTO) {
        return ResponseEntity.ok(supplierService.updateSupplier(supplierId, supplierRequestDTO));
    }

    @DeleteMapping("/{supplier_id}")
    public ResponseEntity<String> deleteSupplierById(@PathVariable("supplier_id") Integer supplierId) {
        supplierService.deleteSupplierById(supplierId);
        return ResponseEntity.ok("Supplier deleted successfully!");
    }
}
