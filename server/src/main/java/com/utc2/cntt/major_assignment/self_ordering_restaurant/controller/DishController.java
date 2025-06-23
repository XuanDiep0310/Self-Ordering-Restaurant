package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.DishRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.DishResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.DishStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/api/dishes")
public class DishController {
    @Autowired
    DishService dishService;

    @GetMapping
    public ResponseEntity<List<DishResponseDTO>> getAllDishes(@RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(dishService.getAllDishes(categoryId));
    }

    @GetMapping("/{dishId}")
    public ResponseEntity<DishResponseDTO> getDishById(@PathVariable Integer dishId) {
        return ResponseEntity.ok(dishService.getDishById(dishId));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addDish(
            @RequestParam("name") String name,
            @RequestParam("price") Long price,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "status", required = false) DishStatus status,
            @RequestParam("imageFile") MultipartFile imageFile) {

        DishRequestDTO dishRequestDTO = new DishRequestDTO();
        dishRequestDTO.setName(name);
        dishRequestDTO.setPrice(price);
        dishRequestDTO.setCategoryId(categoryId);
        dishRequestDTO.setImageFile(imageFile);

        if (status != null) {
            dishRequestDTO.setStatus(status);
        }

        dishService.addDish(dishRequestDTO);
        return ResponseEntity.ok("Dish added successfully!");
    }

    @DeleteMapping("/{dishId}")
    public ResponseEntity<?> deleteDish(@PathVariable Integer dishId) {
        dishService.deleteDishById(dishId);
        return ResponseEntity.ok("Dish deleted successfully!");
    }

    @PutMapping("/{dishId}")
    public ResponseEntity<?> updateDish(
            @PathVariable Integer dishId,
            @ModelAttribute DishRequestDTO request
    ) {
        dishService.updateDish(dishId, request);
        return ResponseEntity.ok("Dish updated successfully!");
    }
}
