package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Order;
import org.sortoutinnovation.greenmagic.model.OrderItem;
import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.repository.OrderRepository;
import org.sortoutinnovation.greenmagic.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class for Order business logic
 * Handles order processing, status management, and analytics
 */
@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductService productService;

    /**
     * Get all orders with pagination
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    /**
     * Get order by ID
     * @param id order ID
     * @return Order
     * @throws RuntimeException if order not found
     */
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    /**
     * Get orders by user
     * @param userId user ID
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getOrdersByUser(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    /**
     * Get orders by status
     * @param status order status
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getOrdersByStatus(String status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    /**
     * Get orders requiring attention (pending, processing)
     * @return List<Order>
     */
    @Transactional(readOnly = true)
    public List<Order> getOrdersRequiringAttention() {
        return orderRepository.findOrdersRequiringAttention();
    }

    /**
     * Get orders by date range
     * @param startDate start date
     * @param endDate end date
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getOrdersByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        return orderRepository.findByDateRange(startDateTime, endDateTime, pageable);
    }

    /**
     * Create a new order
     * @param order order data
     * @return Order
     * @throws RuntimeException if validation fails
     */
    public Order createOrder(Order order) {
        // Validate order items and check stock
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new RuntimeException("Order must have at least one item");
        }

        // Calculate total and validate stock
        BigDecimal calculatedTotal = BigDecimal.ZERO;
        for (OrderItem item : order.getOrderItems()) {
            Product product = productService.getProductById(item.getProduct().getProductId());
            
            // Check stock availability
            if (!productService.isInStock(product.getProductId(), item.getQuantity())) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Calculate item total
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            calculatedTotal = calculatedTotal.add(itemTotal);
            
            // Set product reference
            item.setProduct(product);
            item.setOrder(order);
        }

        // Set calculated total
        order.setTotalPrice(calculatedTotal);

        // Set default status if not provided
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PENDING");
        }

        // Set default payment status if not provided
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Reduce stock for each item
        for (OrderItem item : savedOrder.getOrderItems()) {
            productService.reduceStock(item.getProduct().getProductId(), item.getQuantity());
        }

        return savedOrder;
    }

    /**
     * Update order status
     * @param id order ID
     * @param status new status
     * @return Order
     * @throws RuntimeException if order not found
     */
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }

    /**
     * Update payment status
     * @param id order ID
     * @param paymentStatus new payment status
     * @return Order
     * @throws RuntimeException if order not found
     */
    public Order updatePaymentStatus(Long id, Order.PaymentStatus paymentStatus) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        order.setPaymentStatus(paymentStatus);
        return orderRepository.save(order);
    }

    /**
     * Cancel order
     * @param id order ID
     * @return Order
     * @throws RuntimeException if order not found or cannot be cancelled
     */
    public Order cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        
        // Check if order can be cancelled
        if ("DELIVERED".equals(order.getStatus()) || "CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order cannot be cancelled in current status: " + order.getStatus());
        }

        // Restore stock for each item
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            // Note: In a real implementation, you'd call productService.updateStock()
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    /**
     * Get total sales for date range
     * @param startDate start date
     * @param endDate end date
     * @return BigDecimal total sales
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalSales(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        return orderRepository.calculateTotalSalesByDateRange(startDateTime, endDateTime);
    }

    /**
     * Get order count for date range
     * @param startDate start date
     * @param endDate end date
     * @return Long order count
     */
    @Transactional(readOnly = true)
    public Long getOrderCount(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        // Use a custom query to count orders in date range
        return orderRepository.findByDateRange(startDateTime, endDateTime, Pageable.unpaged()).getTotalElements();
    }

    /**
     * Get today's orders
     * @return List<Order>
     */
    @Transactional(readOnly = true)
    public List<Order> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);
        return orderRepository.findByDateRange(startOfDay, endOfDay, Pageable.unpaged()).getContent();
    }

    /**
     * Get orders by payment method
     * @param paymentMethod payment method
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getOrdersByPaymentMethod(String paymentMethod, Pageable pageable) {
        return orderRepository.findByPaymentMethod(paymentMethod, pageable);
    }

    /**
     * Get pending payment orders
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getPendingPaymentOrders(Pageable pageable) {
        return orderRepository.findByPaymentStatus(Order.PaymentStatus.PENDING, pageable);
    }

    /**
     * Get completed orders
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Transactional(readOnly = true)
    public Page<Order> getCompletedOrders(Pageable pageable) {
        return orderRepository.findByPaymentStatus(Order.PaymentStatus.COMPLETED, pageable);
    }

    /**
     * Get average order value
     * @return BigDecimal average order value
     */
    @Transactional(readOnly = true)
    public BigDecimal getAverageOrderValue() {
        // Calculate average from all completed orders
        List<Order> allOrders = orderRepository.findByPaymentStatus(Order.PaymentStatus.COMPLETED, Pageable.unpaged()).getContent();
        if (allOrders.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = allOrders.stream()
            .map(Order::getTotalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return total.divide(BigDecimal.valueOf(allOrders.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Get monthly sales report
     * @param year year
     * @param month month
     * @return BigDecimal monthly sales
     */
    @Transactional(readOnly = true)
    public BigDecimal getMonthlySales(int year, int month) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());
        return getTotalSales(startOfMonth, endOfMonth);
    }
} 