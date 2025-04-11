package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.TableResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.TableRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    @Autowired
    private TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableResponseDTO>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @GetMapping("/{tableNumber}")
    public ResponseEntity<?> getTableByTableNumber(@PathVariable("tableNumber") Integer tableNumber) {
        TableResponseDTO tableResponseDTO = tableService.getTableByTableNumber(tableNumber);
        return ResponseEntity.ok(tableResponseDTO);
    }

    @PutMapping("/{table_id}")
    public ResponseEntity<?> updateTableStatus(@PathVariable("table_id") Integer tableNumber, @RequestBody TableRequestDTO tableRequestDTO) {
        tableService.updateTableStatus(tableNumber, tableRequestDTO);
        return ResponseEntity.ok("Table status updated successfully!");
    }
}
