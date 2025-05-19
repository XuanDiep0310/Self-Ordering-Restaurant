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

    @PostMapping
    public ResponseEntity<?> addTable(@RequestBody TableRequestDTO tableRequestDTO) {
        TableResponseDTO newTable = tableService.addTable(tableRequestDTO);
        return ResponseEntity.ok(newTable);
    }

    @PutMapping("/{tableNumber}")
    public ResponseEntity<Void> updateTable(
            @PathVariable Integer tableNumber,
            @RequestBody TableRequestDTO tableRequestDTO) {
        tableService.updateTable(tableNumber, tableRequestDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{tableNumber}")
    public ResponseEntity<?> deleteTable(@PathVariable("tableNumber") Integer tableNumber) {
        tableService.deleteTable(tableNumber);
        return ResponseEntity.ok("Table deleted successfully!");
    }
}
