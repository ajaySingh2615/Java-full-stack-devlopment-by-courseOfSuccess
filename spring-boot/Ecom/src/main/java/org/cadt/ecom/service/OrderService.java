package org.cadt.ecom.service;

import org.cadt.ecom.dto.OrderDTO;
import org.cadt.ecom.dto.OrderItemDTO;
import org.cadt.ecom.model.OrderItem;
import org.cadt.ecom.model.Orders;
import org.cadt.ecom.model.Product;
import org.cadt.ecom.model.User;
import org.cadt.ecom.repo.OrderRepository;
import org.cadt.ecom.repo.ProductRepository;
import org.cadt.ecom.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private UserRepository userRepository;
    private ProductRepository productRepository;
    private OrderRepository orderRepository;

    public OrderService(UserRepository userRepository, ProductRepository productRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public OrderDTO placeOrder(Long userId, Map<Long, Integer> productQuantities, double totalAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Orders order = new Orders();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("Pending");
        order.setTotalAmount(totalAmount);

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemDTO> orderItemDTOS = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry: productQuantities.entrySet()){
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(entry.getValue());
            orderItems.add(orderItem);

            orderItemDTOS.add(new OrderItemDTO(product.getName(), product.getPrice(), entry.getValue()));
        }
        order.setOrderItems(orderItems);
        Orders saveOrder = orderRepository.save(order);
        return new OrderDTO(saveOrder.getId(), saveOrder.getTotalAmount(), saveOrder.getStatus(),
                saveOrder.getOrderDate(), orderItemDTOS);
    }
}
