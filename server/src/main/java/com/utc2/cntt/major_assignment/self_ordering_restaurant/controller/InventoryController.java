package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.InventoryRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.InventoryResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{inventory_id}")
    public ResponseEntity<InventoryResponseDTO> getInventoryById(@PathVariable("inventory_id") Integer inventoryId) {
        return ResponseEntity.ok(inventoryService.getInventoryById(inventoryId));
    }

    @PostMapping
    public ResponseEntity<InventoryResponseDTO> createInventory(@RequestBody InventoryRequestDTO requestDTO) {
        return ResponseEntity.ok(inventoryService.createInventory(requestDTO));
    }

    @PutMapping("/{inventory_id}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(
            @PathVariable("inventory_id") Integer inventoryId, @RequestBody InventoryRequestDTO requestDTO) {
        return ResponseEntity.ok(inventoryService.updateInventory(inventoryId, requestDTO));
    }

    @DeleteMapping("/{inventory_id}")
    public ResponseEntity<String> deleteInventory(@PathVariable("inventory_id") Integer inventoryId) {
        inventoryService.deleteInventoryById(inventoryId);
        return ResponseEntity.ok("Inventory deleted successfully!");
    }
}
