package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.IngredientRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.IngredientResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Ingredients;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Suppliers;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.IngredientRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.SupplierRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class IngredientService {
    @Autowired
    IngredientRepository ingredientRepository;

    @Autowired
    SupplierRepository supplierRepository;

    public List<IngredientResponseDTO> getAllIngredients() {
        return ingredientRepository.findAll().stream()
                .map(ingredient -> new IngredientResponseDTO(
                        ingredient.getIngredientId(),
                        ingredient.getSupplier().getSupplierId(),
                        ingredient.getName(),
                        ingredient.getDescription(),
                        ingredient.getUnit(),
                        ingredient.getCostPerUnit(),
                        ingredient.getStatus(),
                        ingredient.getMinimumQuantity()
                ))
                .collect(Collectors.toList());
    }

    public IngredientResponseDTO getIngredientById(Integer ingredientId) {
        Ingredients ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + ingredientId));
        return new IngredientResponseDTO(
                ingredient.getIngredientId(),
                ingredient.getSupplier().getSupplierId(),
                ingredient.getName(),
                ingredient.getDescription(),
                ingredient.getUnit(),
                ingredient.getCostPerUnit(),
                ingredient.getStatus(),
                ingredient.getMinimumQuantity()
        );
    }

    public IngredientResponseDTO createIngredient(IngredientRequestDTO ingredientRequestDTO) {
        Suppliers supplier = supplierRepository.findById(ingredientRequestDTO.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + ingredientRequestDTO.getSupplierId()));

        Ingredients ingredient = new Ingredients();
        ingredient.setSupplier(supplier);
        ingredient.setName(ingredientRequestDTO.getName());
        ingredient.setDescription(ingredientRequestDTO.getDescription());
        ingredient.setUnit(ingredientRequestDTO.getUnit());
        ingredient.setCostPerUnit(ingredientRequestDTO.getCostPerUnit());
        ingredient.setStatus(ingredientRequestDTO.getStatus());
        ingredient.setMinimumQuantity(ingredientRequestDTO.getMinimumQuantity());

        ingredientRepository.save(ingredient);
        return new IngredientResponseDTO(
                ingredient.getIngredientId(),
                ingredient.getSupplier().getSupplierId(),
                ingredient.getName(),
                ingredient.getDescription(),
                ingredient.getUnit(),
                ingredient.getCostPerUnit(),
                ingredient.getStatus(),
                ingredient.getMinimumQuantity()
        );
    }

    public IngredientResponseDTO updateIngredient(Integer ingredientId, IngredientRequestDTO ingredientRequestDTO) {
        Ingredients ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + ingredientId));

        supplierRepository.findById(ingredientRequestDTO.getSupplierId())
                .ifPresent(ingredient::setSupplier);
        ingredient.setName(ingredientRequestDTO.getName());
        ingredient.setDescription(ingredientRequestDTO.getDescription());
        ingredient.setUnit(ingredientRequestDTO.getUnit());
        ingredient.setCostPerUnit(ingredientRequestDTO.getCostPerUnit());
        ingredient.setStatus(ingredientRequestDTO.getStatus());
        ingredient.setMinimumQuantity(ingredientRequestDTO.getMinimumQuantity());

        ingredientRepository.save(ingredient);
        return new IngredientResponseDTO(
                ingredient.getIngredientId(),
                ingredient.getSupplier().getSupplierId(),
                ingredient.getName(),
                ingredient.getDescription(),
                ingredient.getUnit(),
                ingredient.getCostPerUnit(),
                ingredient.getStatus(),
                ingredient.getMinimumQuantity()
        );
    }

    public void deleteIngredient(Integer ingredientId) {
        if (!ingredientRepository.existsById(ingredientId)) {
            throw new ResourceNotFoundException("Ingredient not found with id: " + ingredientId);
        }
        ingredientRepository.deleteById(ingredientId);
    }
}
