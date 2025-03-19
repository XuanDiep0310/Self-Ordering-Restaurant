package com.utc2.cntt.major_assignment.self_ordering_restaurant.controller;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.DishRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.DishResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/dishes")
public class DishController {
    @Autowired
    DishService dishService;

    @GetMapping
    public ResponseEntity<List<DishResponseDTO>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @PostMapping
    public ResponseEntity<?> addDish(@RequestBody DishRequestDTO dishRequestDTO) {
        dishService.addDish(dishRequestDTO);
        return ResponseEntity.ok("Dish added successfully!");
    }
}
