package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Review;
import org.sortoutinnovation.greenmagic.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponseDto<Page<Review>>> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
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
            Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User reviews retrieved successfully", reviews));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user reviews: " + e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<ApiResponseDto<BigDecimal>> getAverageRating(@PathVariable Long productId) {
        try {
            BigDecimal averageRating = reviewRepository.calculateAverageRatingForProduct(productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Average rating calculated", averageRating));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to calculate average rating: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Review>> createReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewRepository.save(review);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Review created successfully", savedReview));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create review: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Review>> getReviewById(@PathVariable Long id) {
        try {
            Optional<Review> review = reviewRepository.findById(id);
            if (review.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Review found", review.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve review: " + e.getMessage(), null));
        }
    }
} 