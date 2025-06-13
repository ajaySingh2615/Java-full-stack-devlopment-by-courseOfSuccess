package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    @Query("SELECT w FROM Wishlist w WHERE w.user.id = :userId ORDER BY w.createdAt DESC")
    List<Wishlist> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT w FROM Wishlist w WHERE w.user.id = :userId AND w.product.id = :productId")
    Optional<Wishlist> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    @Query("SELECT w FROM Wishlist w WHERE w.product.id = :productId")
    List<Wishlist> findByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(w) FROM Wishlist w WHERE w.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(w) FROM Wishlist w WHERE w.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);
    
    boolean existsByUserIdAndProductId(Long userId, Long productId);
} 