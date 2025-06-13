package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.OrderResponseDto;
import org.sortoutinnovation.greenmagic.mapper.OrderMapper;
import org.sortoutinnovation.greenmagic.model.Order;
import org.sortoutinnovation.greenmagic.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<Page<OrderResponseDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderService.getAllOrders(pageable);
            Page<OrderResponseDto> orderDtos = orders.map(OrderMapper::toSummaryDto);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders retrieved successfully", orderDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            OrderResponseDto orderDto = OrderMapper.toResponseDto(order);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order found", orderDto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve order: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Page<OrderResponseDto>>> getOrdersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderService.getOrdersByUser(userId, pageable);
            Page<OrderResponseDto> orderDtos = orders.map(OrderMapper::toSummaryDto);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User orders retrieved successfully", orderDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user orders: " + e.getMessage(), null));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponseDto<Page<OrderResponseDto>>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Order> orders = orderService.getOrdersByStatus(status, pageable);
            Page<OrderResponseDto> orderDtos = orders.map(OrderMapper::toSummaryDto);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders by status retrieved successfully", orderDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders by status: " + e.getMessage(), null));
        }
    }

    @GetMapping("/requiring-attention")
    public ResponseEntity<ApiResponseDto<List<OrderResponseDto>>> getOrdersRequiringAttention() {
        try {
            List<Order> orders = orderService.getOrdersRequiringAttention();
            List<OrderResponseDto> orderDtos = OrderMapper.toSummaryDtoList(orders);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders requiring attention retrieved successfully", orderDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders requiring attention: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> createOrder(@Valid @RequestBody Order order) {
        try {
            Order savedOrder = orderService.createOrder(order);
            OrderResponseDto orderDto = OrderMapper.toResponseDto(savedOrder);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Order created successfully", orderDto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create order: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponseDto<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            OrderResponseDto orderDto = OrderMapper.toSummaryDto(updatedOrder);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order status updated successfully", orderDto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update order status: " + e.getMessage(), null));
        }
    }
} 