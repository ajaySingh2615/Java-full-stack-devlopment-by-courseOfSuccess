package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for order response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {

    private Integer orderId;
    private String status;
    private String paymentMethod;
    private Order.PaymentStatus paymentStatus;
    private BigDecimal totalPrice;
    private BigDecimal subtotal;
    private BigDecimal totalTax;
    private String paymentCurrency;
    private AddressDto shippingAddress;
    private List<OrderItemResponseDto> orderItems;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate;

    // For payment gateway integration
    private String razorpayOrderId;
    private String razorpayPaymentId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDto {
        private Integer orderItemId;
        private Integer productId;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal taxRate;
        private BigDecimal taxAmount;
        private String hsnCode;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        private Integer addressId;
        private String name;
        private String addressLine;
        private String city;
        private String state;
        private String zipCode;
        private String country;
        private String phoneNumber;
    }

    // Constructor for order summary
    public OrderResponseDto(Integer orderId, String status, BigDecimal totalPrice, LocalDateTime orderDate, Order.PaymentStatus paymentStatus) {
        this.orderId = orderId;
        this.status = status;
        this.totalPrice = totalPrice;
        this.orderDate = orderDate;
        this.paymentStatus = paymentStatus;
    }
} 