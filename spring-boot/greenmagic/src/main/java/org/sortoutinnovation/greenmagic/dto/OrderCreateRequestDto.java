package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for order creation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequestDto {

    @NotNull(message = "Address ID is required")
    private Integer addressId;

    @NotBlank(message = "Payment method is required")
    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    private String paymentMethod;

    @NotEmpty(message = "Order items are required")
    @Valid
    private List<OrderItemDto> orderItems;

    private String paymentId;
    private String paymentGateway;
    private String razorpayOrderId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {

        @NotNull(message = "Product ID is required")
        private Integer productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        private BigDecimal price;

        @DecimalMin(value = "0.00", message = "Tax rate must be greater than or equal to 0")
        private BigDecimal taxRate = BigDecimal.ZERO;

        @DecimalMin(value = "0.00", message = "Tax amount must be greater than or equal to 0")
        private BigDecimal taxAmount = BigDecimal.ZERO;

        private String hsnCode;
    }
} 