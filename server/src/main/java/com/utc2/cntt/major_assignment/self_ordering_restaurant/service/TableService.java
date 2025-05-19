package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.TableRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.TableResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.TableStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableService {
    private final TableRepository tableRepository;
    private final WebSocketService webSocketService;

    private static final String TABLES_TOPIC = "/topic/tables";

    @Transactional
    public List<TableResponseDTO> getAllTables() {
        List<Tables> tables = tableRepository.findAll();
        return tables.stream()
                .map(table -> new TableResponseDTO(table.getTableNumber(), table.getCapacity(), table.getLocation(), table.getStatus()))
                .collect(Collectors.toList());
    }

    public void updateTableStatus(Integer tableNumber, TableRequestDTO tableRequestDTO) {
        Tables table = tableRepository.findById(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableNumber));
        table.setStatus(tableRequestDTO.getStatus());
        tableRepository.save(table);

        webSocketService.sendMessage(TABLES_TOPIC, getAllTables());
    }

    public TableResponseDTO getTableByTableNumber(Integer tableNumber) {
        Tables table = tableRepository.findById(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableNumber));
        return new TableResponseDTO(table.getTableNumber(), table.getCapacity(), table.getLocation(), table.getStatus());
    }

    public TableResponseDTO addTable(TableRequestDTO tableRequestDTO) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (tableRequestDTO.getCapacity() <= 0 || tableRequestDTO.getLocation() == null || tableRequestDTO.getLocation().isEmpty()) {
                throw new IllegalArgumentException("Invalid table data: Capacity must be greater than 0 and location must not be empty.");
            }

            Tables newTable = new Tables();
            newTable.setCapacity(tableRequestDTO.getCapacity());
            newTable.setLocation(tableRequestDTO.getLocation());
            newTable.setStatus(tableRequestDTO.getStatus() != null ? tableRequestDTO.getStatus() : TableStatus.Available); // Đảm bảo giá trị status hợp lệ

            Tables savedTable = tableRepository.save(newTable);

            // Gửi thông báo qua WebSocket
            webSocketService.sendMessage(TABLES_TOPIC, getAllTables());

            return new TableResponseDTO(savedTable.getTableNumber(), savedTable.getCapacity(), savedTable.getLocation(), savedTable.getStatus());
        } catch (Exception e) {
            throw new RuntimeException("Error adding table: " + e.getMessage(), e);
        }
    }

    public void deleteTable(Integer tableNumber) {
        Tables table = tableRepository.findById(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableNumber));
        tableRepository.delete(table);
    }

    public void updateTable(Integer tableNumber, TableRequestDTO tableRequestDTO) {
        Tables table = tableRepository.findById(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableNumber));
        table.setCapacity(tableRequestDTO.getCapacity());
        table.setLocation(tableRequestDTO.getLocation());
        table.setStatus(tableRequestDTO.getStatus());
        tableRepository.save(table);

        webSocketService.sendMessage(TABLES_TOPIC, getAllTables());
    }
}
