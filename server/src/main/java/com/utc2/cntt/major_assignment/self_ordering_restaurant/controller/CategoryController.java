package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.CategoryRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.CategoryResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{category_id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable("category_id") Integer categoryId) {
        return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(categoryRequestDTO));
    }

    @PutMapping("/{category_id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable("category_id") Integer categoryId,
            @RequestBody CategoryRequestDTO categoryRequestDTO) {
        return ResponseEntity.ok(categoryService.updateCategory(categoryId, categoryRequestDTO));
    }

    @DeleteMapping("/{category_id}")
    public ResponseEntity<String> deleteCategoryById(@PathVariable("category_id") Integer categoryId) {
        categoryService.deleteCategoryById(categoryId);
        return ResponseEntity.ok("Category deleted successfully!");
    }
}
