package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.CategoryRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.CategoryResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Categories;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryResponseDTO(
                        category.getCategoryId(), category.getName(), category.getDescription(),
                        category.getImage(), category.getStatus()))
                .collect(Collectors.toList());
    }

    public CategoryResponseDTO getCategoryById(Integer categoryId) {
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        return new CategoryResponseDTO(category.getCategoryId(), category.getName(),
                category.getDescription(), category.getImage(), category.getStatus());
    }

    public CategoryResponseDTO createCategory(CategoryRequestDTO categoryRequestDTO) {
        Categories category = new Categories();
        category.setName(categoryRequestDTO.getName());
        category.setDescription(categoryRequestDTO.getDescription());
        category.setImage(categoryRequestDTO.getImage());
        category.setStatus(categoryRequestDTO.getStatus());

        categoryRepository.save(category);
        return new CategoryResponseDTO(category.getCategoryId(), category.getName(),
                category.getDescription(), category.getImage(), category.getStatus());
    }

    public CategoryResponseDTO updateCategory(Integer categoryId, CategoryRequestDTO categoryRequestDTO) {
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        category.setName(categoryRequestDTO.getName());
        category.setDescription(categoryRequestDTO.getDescription());
        category.setImage(categoryRequestDTO.getImage());
        category.setStatus(categoryRequestDTO.getStatus());

        categoryRepository.save(category);
        return new CategoryResponseDTO(category.getCategoryId(), category.getName(),
                category.getDescription(), category.getImage(), category.getStatus());
    }

    public void deleteCategoryById(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
    }
}
