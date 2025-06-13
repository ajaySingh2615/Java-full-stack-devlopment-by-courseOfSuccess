package org.cadt.ecom.controller;

import org.cadt.ecom.dto.OrderDTO;
import org.cadt.ecom.model.OrderRequest;
import org.cadt.ecom.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place/{userId}")
    public OrderDTO placeOrder(@PathVariable Long userId, @RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(userId, orderRequest.getProductQuantities(), orderRequest.getTotalAmount());
    }
}
