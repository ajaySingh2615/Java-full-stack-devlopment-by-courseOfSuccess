package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Review;
import org.sortoutinnovation.greenmagic.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Service class for Review business logic
 * Handles product review management and rating calculations
 */
@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Get reviews for a product
     * @param productId product ID
     * @param pageable pagination information
     * @return Page<Review>
     */
    @Transactional(readOnly = true)
    public Page<Review> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable);
    }

    /**
     * Get reviews by user
     * @param userId user ID
     * @param pageable pagination information
     * @return Page<Review>
     */
    @Transactional(readOnly = true)
    public Page<Review> getUserReviews(Long userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable);
    }

    /**
     * Get review by ID
     * @param id review ID
     * @return Review
     * @throws RuntimeException if review not found
     */
    @Transactional(readOnly = true)
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }

    /**
     * Create a new review
     * @param review review data
     * @return Review
     * @throws RuntimeException if user already reviewed the product
     */
    public Review createReview(Review review) {
        // Check if user already reviewed this product
        if (reviewRepository.findByUserIdAndProductId(
            review.getUser().getUserId().longValue(), 
            review.getProduct().getProductId().longValue()).isPresent()) {
            throw new RuntimeException("User has already reviewed this product");
        }

        return reviewRepository.save(review);
    }

    /**
     * Update review
     * @param id review ID
     * @param updatedReview updated review data
     * @return Review
     * @throws RuntimeException if review not found
     */
    public Review updateReview(Long id, Review updatedReview) {
        Review existingReview = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        // Update fields
        if (updatedReview.getRating() != null) {
            existingReview.setRating(updatedReview.getRating());
        }
        if (updatedReview.getTitle() != null) {
            existingReview.setTitle(updatedReview.getTitle());
        }
        if (updatedReview.getContent() != null) {
            existingReview.setContent(updatedReview.getContent());
        }

        return reviewRepository.save(existingReview);
    }

    /**
     * Delete review
     * @param id review ID
     * @throws RuntimeException if review not found
     */
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    /**
     * Get average rating for a product
     * @param productId product ID
     * @return BigDecimal average rating
     */
    @Transactional(readOnly = true)
    public BigDecimal getAverageRating(Long productId) {
        BigDecimal average = reviewRepository.calculateAverageRatingForProduct(productId);
        return average != null ? average.setScale(1, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }

    /**
     * Get review count for a product
     * @param productId product ID
     * @return Long review count
     */
    @Transactional(readOnly = true)
    public Long getReviewCount(Long productId) {
        return reviewRepository.countByProductId(productId);
    }

    /**
     * Check if user can review product
     * @param userId user ID
     * @param productId product ID
     * @return boolean true if user can review
     */
    @Transactional(readOnly = true)
    public boolean canUserReviewProduct(Long userId, Long productId) {
        return reviewRepository.findByUserIdAndProductId(userId, productId).isEmpty();
    }

    /**
     * Get reviews by rating
     * @param productId product ID
     * @param rating rating value
     * @param pageable pagination information
     * @return Page<Review>
     */
    @Transactional(readOnly = true)
    public Page<Review> getReviewsByRating(Long productId, Integer rating, Pageable pageable) {
        // This method would need to be implemented in repository
        // For now, return all product reviews
        return reviewRepository.findByProductId(productId, pageable);
    }

    /**
     * Get recent reviews
     * @param pageable pagination information
     * @return Page<Review>
     */
    @Transactional(readOnly = true)
    public Page<Review> getRecentReviews(Pageable pageable) {
        // This method would need to be implemented in repository
        // For now, return all reviews
        return reviewRepository.findAll(pageable);
    }
} 