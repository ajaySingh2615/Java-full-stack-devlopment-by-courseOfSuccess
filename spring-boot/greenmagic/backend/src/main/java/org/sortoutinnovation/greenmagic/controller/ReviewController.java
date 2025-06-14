package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Review;
import org.sortoutinnovation.greenmagic.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponseDto<Page<Review>>> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Review> reviews = reviewService.getProductReviews(productId, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Reviews retrieved successfully", reviews));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve reviews: " + e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<Page<Review>>> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Review> reviews = reviewService.getUserReviews(userId, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User reviews retrieved successfully", reviews));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user reviews: " + e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<ApiResponseDto<BigDecimal>> getAverageRating(@PathVariable Long productId) {
        try {
            BigDecimal averageRating = reviewService.getAverageRating(productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Average rating calculated", averageRating));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to calculate average rating: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Review>> createReview(@Valid @RequestBody Review review) {
        try {
            Review savedReview = reviewService.createReview(review);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Review created successfully", savedReview));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create review: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Review>> getReviewById(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Review found", review));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve review: " + e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<ApiResponseDto<Long>> getReviewCount(@PathVariable Long productId) {
        try {
            Long count = reviewService.getReviewCount(productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Review count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to get review count: " + e.getMessage(), null));
        }
    }
} 