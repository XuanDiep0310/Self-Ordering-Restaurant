package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.TableDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.UpdateTableStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    @Autowired
    private TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableDTO>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    @PutMapping("/{table_id}")
    public ResponseEntity<?> updateTableStatus(@PathVariable("table_id") Integer tableNumber, @RequestBody UpdateTableStatusDTO updateTableStatusDTO) {
        tableService.updateTableStatus(tableNumber, updateTableStatusDTO);
        return ResponseEntity.ok("{ \"message\": \"Table status updated successfully!\" }");
    }
}
