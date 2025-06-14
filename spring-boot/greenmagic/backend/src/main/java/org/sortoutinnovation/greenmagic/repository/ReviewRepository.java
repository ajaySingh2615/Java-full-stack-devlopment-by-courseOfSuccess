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
    
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    Page<Review> findByProductId(@Param("productId") Long productId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    Page<Review> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId AND r.product.id = :productId")
    Optional<Review> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.rating >= :minRating ORDER BY r.rating DESC")
    List<Review> findByProductIdAndMinRating(@Param("productId") Long productId, @Param("minRating") BigDecimal minRating);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    BigDecimal calculateAverageRatingForProduct(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);
} 