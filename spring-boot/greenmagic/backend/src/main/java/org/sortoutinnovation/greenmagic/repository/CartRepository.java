package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Cart entity operations
 * Provides CRUD operations and custom queries for cart management
 */
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    
    /**
     * Find cart by user ID
     * @param userId the user ID
     * @return Optional<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.user.userId = :userId")
    Optional<Cart> findByUserId(@Param("userId") Long userId);
    
    /**
     * Find carts created after a certain date
     * @param since datetime threshold
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.createdAt >= :since ORDER BY c.createdAt DESC")
    List<Cart> findRecentCarts(@Param("since") LocalDateTime since);
    
    /**
     * Find old carts (created before a certain date)
     * @param before datetime threshold
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.createdAt < :before ORDER BY c.createdAt")
    List<Cart> findOldCarts(@Param("before") LocalDateTime before);
    
    /**
     * Find carts with items
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE SIZE(c.cartItems) > 0 ORDER BY c.createdAt DESC")
    List<Cart> findCartsWithItems();
    
    /**
     * Find empty carts
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE SIZE(c.cartItems) = 0 ORDER BY c.createdAt")
    List<Cart> findEmptyCarts();
    
    /**
     * Count carts by user ID
     * @param userId the user ID
     * @return long count of carts
     */
    @Query("SELECT COUNT(c) FROM Cart c WHERE c.user.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    /**
     * Delete old empty carts
     * @param before datetime threshold
     * @return number of deleted carts
     */
    @Query("DELETE FROM Cart c WHERE SIZE(c.cartItems) = 0 AND c.createdAt < :before")
    int deleteOldEmptyCarts(@Param("before") LocalDateTime before);
} 