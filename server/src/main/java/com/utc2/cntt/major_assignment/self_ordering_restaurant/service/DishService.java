package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.DishRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.DishResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Categories;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Dishes;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CategoryRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {
    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;

    public List<DishResponseDTO> getAllDishes(Integer categoryId) {
        List<Dishes> dishes;

        if (categoryId != null) {
            dishes = dishRepository.findByCategory_CategoryId(categoryId);
        } else {
            dishes = dishRepository.findAll();
        }

        return dishes.stream()
                .map(dish -> new DishResponseDTO(dish.getDishId(), dish.getName(), dish.getImage(), dish.getPrice(), dish.getStatus()))
                .collect(Collectors.toList());
    }

    public DishResponseDTO getDishById(Integer dishId) {
        Dishes dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + dishId));

        return new DishResponseDTO(dish.getDishId(), dish.getName(), dish.getImage(), dish.getPrice(), dish.getStatus());
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

    public void deleteDishById(Integer dishId) {
        Dishes dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + dishId));
        dishRepository.delete(dish);
    }

}

