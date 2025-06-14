package org.sortoutinnovation.greenmagic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for cart response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {

    private Integer cartId;
    private Integer userId;
    private List<CartItemDto> cartItems;
    private Integer totalItems;
    private BigDecimal totalAmount;
    private BigDecimal totalTax;
    private BigDecimal grandTotal;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        private Integer cartItemId;
        private Integer productId;
        private String productName;
        private String productImage;
        private BigDecimal productPrice;
        private BigDecimal regularPrice;
        private Integer quantity;
        private BigDecimal itemTotal;
        private Boolean inStock;
        private Integer availableQuantity;
        private String brand;
        private Boolean isFeatured;
    }

    // Constructor for empty cart
    public CartResponseDto(Integer cartId, Integer userId) {
        this.cartId = cartId;
        this.userId = userId;
        this.totalItems = 0;
        this.totalAmount = BigDecimal.ZERO;
        this.totalTax = BigDecimal.ZERO;
        this.grandTotal = BigDecimal.ZERO;
    }
} 