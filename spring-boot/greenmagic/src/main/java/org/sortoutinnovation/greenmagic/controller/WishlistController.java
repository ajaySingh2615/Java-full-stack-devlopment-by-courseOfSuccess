package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Wishlist;
import org.sortoutinnovation.greenmagic.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<List<Wishlist>>> getUserWishlist(@PathVariable Long userId) {
        try {
            List<Wishlist> wishlist = wishlistRepository.findByUserId(userId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Wishlist retrieved successfully", wishlist));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve wishlist: " + e.getMessage(), null));
        }
    }

    @PostMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<ApiResponseDto<Wishlist>> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            // Check if item already exists in wishlist
            if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "Product already in wishlist", null));
            }

            Wishlist wishlistItem = new Wishlist();
            // Set user and product relationships here when entities are available
            
            Wishlist savedWishlistItem = wishlistRepository.save(wishlistItem);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product added to wishlist successfully", savedWishlistItem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to add to wishlist: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<ApiResponseDto<Void>> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            Optional<Wishlist> wishlistItem = wishlistRepository.findByUserIdAndProductId(userId, productId);
            if (wishlistItem.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            wishlistRepository.delete(wishlistItem.get());
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product removed from wishlist successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to remove from wishlist: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponseDto<Long>> getWishlistCount(@PathVariable Long userId) {
        try {
            long count = wishlistRepository.countByUserId(userId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Wishlist count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get wishlist count: " + e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<ApiResponseDto<Long>> getProductWishlistCount(@PathVariable Long productId) {
        try {
            long count = wishlistRepository.countByProductId(productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product wishlist count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get product wishlist count: " + e.getMessage(), null));
        }
    }
} 