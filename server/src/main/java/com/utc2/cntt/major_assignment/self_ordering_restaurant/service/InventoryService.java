package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.InventoryRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.InventoryResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Ingredients;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Inventory;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Suppliers;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.IngredientRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.InventoryRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.SupplierRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {
    @Autowired
    InventoryRepository inventoryRepository;

    @Autowired
    IngredientRepository ingredientRepository;

    @Autowired
    SupplierRepository supplierRepository;

    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(inventory -> new InventoryResponseDTO(
                        inventory.getInventoryId(),
                        inventory.getIngredient().getName(),
                        inventory.getSupplier().getName(),
                        inventory.getQuantity(),
                        inventory.getUnit(),
                        inventory.getLastUpdated()
                ))
                .collect(Collectors.toList());
    }

    public InventoryResponseDTO getInventoryById(Integer inventoryId) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found with ID: " + inventoryId));

        return new InventoryResponseDTO(
                inventory.getInventoryId(),
                inventory.getIngredient().getName(),
                inventory.getSupplier().getName(),
                inventory.getQuantity(),
                inventory.getUnit(),
                inventory.getLastUpdated()
        );
    }

    public InventoryResponseDTO createInventory(InventoryRequestDTO requestDTO) {
        if (requestDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        if (requestDTO.getUnit() == null || requestDTO.getUnit().isEmpty()) {
            throw new IllegalArgumentException("Unit cannot be null or empty");
        }

        Ingredients ingredient = ingredientRepository.findById(requestDTO.getIngredientId())
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found!"));

        Suppliers supplier = supplierRepository.findById(requestDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found!"));

        Inventory existingInventory = inventoryRepository.findByIngredientIdAndSupplierId(
                requestDTO.getIngredientId(), requestDTO.getSupplierId());

        Inventory inventory;
        if (existingInventory != null) {
            inventory = existingInventory;
            inventory.setQuantity(inventory.getQuantity() + requestDTO.getQuantity());
            inventory.setUnit(requestDTO.getUnit());
        } else {
            inventory = new Inventory();
            inventory.setIngredient(ingredient);
            inventory.setSupplier(supplier);
            inventory.setQuantity(requestDTO.getQuantity());
            inventory.setUnit(requestDTO.getUnit());
        }

        Inventory savedInventory = inventoryRepository.save(inventory);

        return new InventoryResponseDTO(
                savedInventory.getInventoryId(),
                savedInventory.getIngredient().getName(),
                savedInventory.getSupplier().getName(),
                savedInventory.getQuantity(),
                savedInventory.getUnit(),
                savedInventory.getLastUpdated()
        );
    }

    public InventoryResponseDTO updateInventory(Integer inventoryId, InventoryRequestDTO requestDTO) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found!"));

        Ingredients ingredient = ingredientRepository.findById(requestDTO.getIngredientId())
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found!"));

        Suppliers supplier = supplierRepository.findById(requestDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found!"));

        inventory.setIngredient(ingredient);
        inventory.setSupplier(supplier);
        inventory.setQuantity(requestDTO.getQuantity());
        inventory.setUnit(requestDTO.getUnit());

        Inventory updatedInventory = inventoryRepository.save(inventory);
        inventoryRepository.flush();

        return new InventoryResponseDTO(
                updatedInventory.getInventoryId(),
                updatedInventory.getIngredient().getName(),
                updatedInventory.getSupplier().getName(),
                updatedInventory.getQuantity(),
                updatedInventory.getUnit(),
                updatedInventory.getLastUpdated()
        );
    }

    public void deleteInventoryById(Integer inventoryId) {
        if (!inventoryRepository.existsById(inventoryId)) {
            throw new ResourceNotFoundException("Inventory not found with ID: " + inventoryId);
        }
        inventoryRepository.deleteById(inventoryId);
    }

    public List<InventoryResponseDTO> searchInventoryByName(String name) {
        return inventoryRepository.findByIngredientNameContainingIgnoreCase(name).stream()
                .map(inventory -> new InventoryResponseDTO(
                        inventory.getInventoryId(),
                        inventory.getIngredient().getName(),
                        inventory.getSupplier().getName(),
                        inventory.getQuantity(),
                        inventory.getUnit(),
                        inventory.getLastUpdated()
                ))
                .collect(Collectors.toList());
    }
}
