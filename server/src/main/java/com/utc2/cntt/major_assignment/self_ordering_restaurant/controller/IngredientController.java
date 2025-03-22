package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.IngredientRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.IngredientResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {
    @Autowired
    IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<List<IngredientResponseDTO>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    @GetMapping("/{ingredient_id}")
    public ResponseEntity<IngredientResponseDTO> getIngredientById(@PathVariable("ingredient_id") Integer ingredientId) {
        return ResponseEntity.ok(ingredientService.getIngredientById(ingredientId));
    }

    @PostMapping
    public ResponseEntity<IngredientResponseDTO> createIngredient(@RequestBody IngredientRequestDTO ingredientRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredientService.createIngredient(ingredientRequestDTO));
    }

    @PutMapping("/{ingredient_id}")
    public ResponseEntity<IngredientResponseDTO> updateIngredient(
            @PathVariable("ingredient_id") Integer ingredientId,
            @RequestBody IngredientRequestDTO ingredientRequestDTO) {
        return ResponseEntity.ok(ingredientService.updateIngredient(ingredientId, ingredientRequestDTO));
    }

    @DeleteMapping("/{ingredient_id}")
    public ResponseEntity<String> deleteIngredient(@PathVariable("ingredient_id") Integer ingredientId) {
        ingredientService.deleteIngredient(ingredientId);
        return ResponseEntity.ok("Ingredient deleted successfully");
    }
}
