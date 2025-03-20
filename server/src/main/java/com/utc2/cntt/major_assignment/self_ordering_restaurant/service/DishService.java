package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.DishRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.DishResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Categories;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Dishes;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CategoryRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {
    @Autowired
    DishRepository dishRepository;

    @Autowired
    CategoryRepository categoryRepository;

    public List<DishResponseDTO> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(dish -> new DishResponseDTO(dish.getDishId(), dish.getName(), dish.getPrice(), dish.getStatus()))
                .collect(Collectors.toList());
    }

    public void addDish(DishRequestDTO dishRequestDTO) {
        Categories category = categoryRepository.findById(dishRequestDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dishRequestDTO.getCategoryId()));

        Dishes dish = new Dishes();
        dish.setName(dishRequestDTO.getName());
        dish.setPrice(dishRequestDTO.getPrice());
        dish.setCategory(category);
        dish.setStatus(dishRequestDTO.getStatus());

        dishRepository.save(dish);
    }
}
