package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Order;
import org.sortoutinnovation.greenmagic.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<ApiResponseDto<Page<Order>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderRepository.findAll(pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Order>> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> order = orderRepository.findById(id);
            if (order.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order found", order.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve order: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Page<Order>>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderRepository.findByUserId(userId, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user orders: " + e.getMessage(), null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponseDto<Page<Order>>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderRepository.findByStatus(status, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders by status retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders by status: " + e.getMessage(), null));
        }
    }

    @GetMapping("/requiring-attention")
    public ResponseEntity<ApiResponseDto<List<Order>>> getOrdersRequiringAttention() {
        try {
            List<Order> orders = orderRepository.findOrdersRequiringAttention();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders requiring attention retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders requiring attention: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Order>> createOrder(@RequestBody Order order) {
        try {
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Order created successfully", savedOrder));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create order: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponseDto<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order status updated successfully", updatedOrder));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update order status: " + e.getMessage(), null));
        }
    }
} 