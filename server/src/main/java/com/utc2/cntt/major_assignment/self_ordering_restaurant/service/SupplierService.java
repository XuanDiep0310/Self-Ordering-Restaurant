package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.SupplierRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.SupplierResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Suppliers;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    @Autowired
    SupplierRepository supplierRepository;

    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(supplier -> new SupplierResponseDTO(
                        supplier.getSupplyId(), supplier.getName(), supplier.getContactPerson(),
                        supplier.getPhone(), supplier.getEmail(), supplier.getAddress()))
                .collect(Collectors.toList());
    }

    public SupplierResponseDTO getSupplierById(Integer supplierId) {
        Suppliers supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));
        return new SupplierResponseDTO(
                supplier.getSupplyId(), supplier.getName(), supplier.getContactPerson(),
                supplier.getPhone(), supplier.getEmail(), supplier.getAddress());
    }

    public SupplierResponseDTO createSupplier(SupplierRequestDTO supplierRequestDTO) {
        Suppliers supplier = new Suppliers();
        supplier.setName(supplierRequestDTO.getName());
        supplier.setContactPerson(supplierRequestDTO.getContactPerson());
        supplier.setPhone(supplierRequestDTO.getPhone());
        supplier.setEmail(supplierRequestDTO.getEmail());
        supplier.setAddress(supplierRequestDTO.getAddress());

        supplierRepository.save(supplier);
        return new SupplierResponseDTO(
                supplier.getSupplyId(), supplier.getName(), supplier.getContactPerson(),
                supplier.getPhone(), supplier.getEmail(), supplier.getAddress());
    }

    public SupplierResponseDTO updateSupplier(Integer supplierId, SupplierRequestDTO supplierRequestDTO) {
        Suppliers supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));

        supplier.setName(supplierRequestDTO.getName());
        supplier.setContactPerson(supplierRequestDTO.getContactPerson());
        supplier.setPhone(supplierRequestDTO.getPhone());
        supplier.setEmail(supplierRequestDTO.getEmail());
        supplier.setAddress(supplierRequestDTO.getAddress());

        supplierRepository.save(supplier);
        return new SupplierResponseDTO(
                supplier.getSupplyId(), supplier.getName(), supplier.getContactPerson(),
                supplier.getPhone(), supplier.getEmail(), supplier.getAddress());
    }

    public void deleteSupplierById(Integer supplierId) {
        if (!supplierRepository.existsById(supplierId)) {
            throw new ResourceNotFoundException("Supplier not found with id: " + supplierId);
        }
        supplierRepository.deleteById(supplierId);
    }
}
