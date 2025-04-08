package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.DishRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.DishResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<?> addDish(@RequestBody DishRequestDTO dishRequestDTO) {
        dishService.addDish(dishRequestDTO);
        return ResponseEntity.ok("Dish added successfully!");
    }
}
