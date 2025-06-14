package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Wishlist;
import org.sortoutinnovation.greenmagic.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<List<Wishlist>>> getUserWishlist(@PathVariable Long userId) {
        try {
            List<Wishlist> wishlist = wishlistService.getUserWishlist(userId);
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
            Wishlist savedWishlistItem = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product added to wishlist successfully", savedWishlistItem));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
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
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product removed from wishlist successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to remove from wishlist: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponseDto<Long>> getWishlistCount(@PathVariable Long userId) {
        try {
            Long count = wishlistService.getWishlistCount(userId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Wishlist count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get wishlist count: " + e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<ApiResponseDto<Long>> getProductWishlistCount(@PathVariable Long productId) {
        try {
            Long count = wishlistService.getProductWishlistCount(productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product wishlist count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get product wishlist count: " + e.getMessage(), null));
        }
    }
} 