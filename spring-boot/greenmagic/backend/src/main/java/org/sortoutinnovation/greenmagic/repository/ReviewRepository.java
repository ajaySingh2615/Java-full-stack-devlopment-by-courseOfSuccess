package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    @Query("SELECT r FROM Review r WHERE r.product.productId = :productId ORDER BY r.createdAt DESC")
    Page<Review> findByProductId(@Param("productId") Integer productId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    Page<Review> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId AND r.product.productId = :productId")
    Optional<Review> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Integer productId);
    
    @Query("SELECT r FROM Review r WHERE r.product.productId = :productId AND r.rating >= :minRating ORDER BY r.rating DESC")
    List<Review> findByProductIdAndMinRating(@Param("productId") Integer productId, @Param("minRating") BigDecimal minRating);
    
    /**
     * Get average rating by product ID
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    BigDecimal calculateAverageRatingForProduct(@Param("productId") Integer productId);
    
    /**
     * Count reviews by product ID
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    long countByProductId(@Param("productId") Integer productId);
    
    // Get list of reviews by product ID (no pagination)
    @Query("SELECT r FROM Review r WHERE r.product.productId = :productId")
    List<Review> findAllByProductId(@Param("productId") Integer productId);
} 