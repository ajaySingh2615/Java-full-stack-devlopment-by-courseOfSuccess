package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Cart;
import org.sortoutinnovation.greenmagic.model.CartItem;
import org.sortoutinnovation.greenmagic.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Cart management operations
 * Provides endpoints for shopping cart functionality
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Cart>> getUserCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getUserCart(userId);
            if (cart == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart retrieved successfully", cart));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve cart: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<ApiResponseDto<List<CartItem>>> getCartItems(@PathVariable Long cartId) {
        try {
            List<CartItem> items = cartService.getCartItems(cartId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart items retrieved successfully", items));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve cart items: " + e.getMessage(), null));
        }
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Cart>> createCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.createCart(userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Cart created successfully", cart));
                
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create cart: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<ApiResponseDto<CartItem>> addItemToCart(
            @PathVariable Long cartId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        
        try {
            CartItem cartItem = cartService.addItemToCart(cartId, productId, quantity);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Item added to cart successfully", cartItem));
                
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to add item to cart: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponseDto<Void>> removeItemFromCart(@PathVariable Long itemId) {
        try {
            cartService.removeItemFromCart(itemId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Item removed from cart successfully", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to remove item from cart: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponseDto<Void>> clearCart(@PathVariable Long cartId) {
        try {
            cartService.clearCart(cartId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart cleared successfully", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to clear cart: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/total")
    public ResponseEntity<ApiResponseDto<BigDecimal>> getCartTotal(@PathVariable Long cartId) {
        try {
            BigDecimal total = cartService.getCartTotal(cartId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart total calculated successfully", total));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to calculate cart total: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/count")
    public ResponseEntity<ApiResponseDto<Integer>> getCartItemCount(@PathVariable Long cartId) {
        try {
            Integer count = cartService.getCartItemCount(cartId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart item count retrieved successfully", count));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get cart item count: " + e.getMessage(), null));
        }
    }
} 