package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.TableRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.TableResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
