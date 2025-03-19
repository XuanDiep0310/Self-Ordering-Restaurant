package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.TableDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.UpdateTableStatusDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Tables;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.TableRepository;
import jakarta.transaction.Transactional;
import org.hibernate.PropertyNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableService {
    @Autowired
    private TableRepository tableRepository;

    @Transactional
    public List<TableDTO> getAllTables() {
        List<Tables> tables = tableRepository.findAll();
        return tables.stream()
                .map(table -> new TableDTO(table.getTableNumber(), table.getCapacity(), table.getStatus()))
                .collect(Collectors.toList());
    }

    public void updateTableStatus(Integer tableNumber, UpdateTableStatusDTO updateTableStatusDTO) {
        Tables table = tableRepository.findById(tableNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableNumber));
        table.setStatus(updateTableStatusDTO.getStatus());
        tableRepository.save(table);
    }
}
