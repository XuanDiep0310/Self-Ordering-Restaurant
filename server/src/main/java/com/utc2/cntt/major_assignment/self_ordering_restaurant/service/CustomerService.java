package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.CustomerRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.CustomerResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.*;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceNotFoundException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.CustomerRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.OrderRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.PaymentRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    public List<CustomerResponseDTO> getAllCustomer() {
        return customerRepository.findAll().stream()
                .map(customer -> new CustomerResponseDTO(
                        customer.getCustomerId(),
                        customer.getFullname(),
                        customer.getJoinDate(),
                        customer.getPoints()))
                .collect(Collectors.toList());
    }

    public CustomerResponseDTO getCustomerById(Integer customerId) {
        Customers customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
        return new CustomerResponseDTO(customer.getCustomerId(), customer.getFullname(), customer.getJoinDate(), customer.getPoints());
    }

    public CustomerResponseDTO createCustomer(CustomerRequestDTO customerRequestDTO) {
        Users user = userRepository.findById(customerRequestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + customerRequestDTO.getUserId()));

        Customers customer = new Customers();
        customer.setUser(user);
        customer.setFullname(customerRequestDTO.getFullname());
        customer.setJoinDate(LocalDateTime.now());
        customer.setPoints(customerRequestDTO.getPoints());

        Customers savedCustomer = customerRepository.save(customer);
        return new CustomerResponseDTO(
                savedCustomer.getCustomerId(),
                savedCustomer.getFullname(),
                savedCustomer.getJoinDate(),
                savedCustomer.getPoints());
    }

    public CustomerResponseDTO updateCustomer(Integer customerId, CustomerRequestDTO customerRequestDTO) {
        Customers customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        customer.setFullname(customerRequestDTO.getFullname());
        customer.setPoints(customerRequestDTO.getPoints());

        Customers updatedCustomer = customerRepository.save(customer);
        return new CustomerResponseDTO(
                updatedCustomer.getCustomerId(),
                updatedCustomer.getFullname(),
                updatedCustomer.getJoinDate(),
                updatedCustomer.getPoints());
    }

    public void deleteCustomer(Integer customerId) {
        Customers customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        customerRepository.delete(customer);
    }

}
