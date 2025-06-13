package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Cart;
import org.sortoutinnovation.greenmagic.model.CartItem;
import org.sortoutinnovation.greenmagic.repository.CartRepository;
import org.sortoutinnovation.greenmagic.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Cart>> getCartByUserId(@PathVariable Long userId) {
        try {
            Optional<Cart> cart = cartRepository.findByUserId(userId);
            if (cart.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart found", cart.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve cart: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<ApiResponseDto<List<CartItem>>> getCartItems(@PathVariable Long cartId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart items retrieved successfully", cartItems));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve cart items: " + e.getMessage(), null));
        }
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Cart>> createCart(@PathVariable Long userId) {
        try {
            // Check if cart already exists for user
            Optional<Cart> existingCart = cartRepository.findByUserId(userId);
            if (existingCart.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "Cart already exists for this user", null));
            }

            Cart cart = new Cart();
            // Note: Cart entity only has user and cartItems fields
            // No totalItems or totalAmount fields exist
            
            Cart savedCart = cartRepository.save(cart);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Cart created successfully", savedCart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create cart: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<ApiResponseDto<CartItem>> addItemToCart(
            @PathVariable Long cartId,
            @RequestBody CartItem cartItem) {
        try {
            // Set cart relationship
            Optional<Cart> cartOpt = cartRepository.findById(cartId);
            if (cartOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            cartItem.setCart(cartOpt.get());
            CartItem savedCartItem = cartItemRepository.save(cartItem);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Item added to cart successfully", savedCartItem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to add item to cart: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponseDto<Void>> removeItemFromCart(@PathVariable Long itemId) {
        try {
            if (!cartItemRepository.existsById(itemId)) {
                return ResponseEntity.notFound().build();
            }
            
            cartItemRepository.deleteById(itemId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Item removed from cart successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to remove item from cart: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponseDto<Void>> clearCart(@PathVariable Long cartId) {
        try {
            Optional<Cart> cartOpt = cartRepository.findById(cartId);
            if (cartOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Clear all items from cart
            List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
            cartItemRepository.deleteAll(cartItems);
            
            // Note: Cart entity doesn't have totalItems/totalAmount fields
            // The cart totals would be calculated dynamically from cart items
            
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Cart cleared successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to clear cart: " + e.getMessage(), null));
        }
    }
} 