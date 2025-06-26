package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.CartResponseDto;
import org.sortoutinnovation.greenmagic.model.Cart;
import org.sortoutinnovation.greenmagic.model.CartItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for Cart entity and DTOs
 */
public class CartMapper {

    public static CartResponseDto toResponseDto(Cart cart) {
        if (cart == null) {
            return null;
        }

        CartResponseDto dto = new CartResponseDto();
        dto.setCartId(cart.getCartId());
        
        if (cart.getUser() != null) {
            dto.setUserId(cart.getUser().getUserId());
        }

        // Map cart items
        if (cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
            List<CartResponseDto.CartItemDto> cartItemDtos = cart.getCartItems().stream()
                .map(CartMapper::toCartItemDto)
                .collect(Collectors.toList());
            
            dto.setCartItems(cartItemDtos);
            
            // Calculate totals
            dto.setTotalItems(cartItemDtos.size());
            
            BigDecimal totalAmount = cartItemDtos.stream()
                .map(CartResponseDto.CartItemDto::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            dto.setTotalAmount(totalAmount);
            dto.setTotalTax(BigDecimal.ZERO); // Calculate tax if needed
            dto.setGrandTotal(totalAmount);
        } else {
            dto.setCartItems(List.of());
            dto.setTotalItems(0);
            dto.setTotalAmount(BigDecimal.ZERO);
            dto.setTotalTax(BigDecimal.ZERO);
            dto.setGrandTotal(BigDecimal.ZERO);
        }

        return dto;
    }

    public static CartResponseDto toEmptyCartDto(Integer cartId, Integer userId) {
        return new CartResponseDto(cartId, userId);
    }

    private static CartResponseDto.CartItemDto toCartItemDto(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        CartResponseDto.CartItemDto dto = new CartResponseDto.CartItemDto();
        dto.setCartItemId(cartItem.getCartItemId());
        dto.setQuantity(cartItem.getQuantity());

        if (cartItem.getProduct() != null) {
            dto.setProductId(cartItem.getProduct().getProductId());
            dto.setProductName(cartItem.getProduct().getName());
            dto.setProductImage(cartItem.getProduct().getImageUrl());
            dto.setProductPrice(cartItem.getProduct().getPrice());
            dto.setRegularPrice(cartItem.getProduct().getMrp());
            dto.setBrand(cartItem.getProduct().getBrand());
            
            // Calculate item total
            BigDecimal itemTotal = cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            dto.setItemTotal(itemTotal);
            
            // Check stock availability
            dto.setInStock(cartItem.getProduct().getQuantity() > 0);
            dto.setAvailableQuantity(cartItem.getProduct().getQuantity());
        }

        return dto;
    }
} 