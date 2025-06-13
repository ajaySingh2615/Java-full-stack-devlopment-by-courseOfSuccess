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
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    /**
     * Find cart by user ID
     * @param userId the user ID
     * @return Optional<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.user.id = :userId")
    Optional<Cart> findByUserId(@Param("userId") Long userId);
    
    /**
     * Find cart by session ID
     * @param sessionId the session ID
     * @return Optional<Cart>
     */
    Optional<Cart> findBySessionId(String sessionId);
    
    /**
     * Find active carts (updated recently)
     * @param since datetime threshold
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.updatedAt >= :since ORDER BY c.updatedAt DESC")
    List<Cart> findActiveCarts(@Param("since") LocalDateTime since);
    
    /**
     * Find abandoned carts (not updated recently)
     * @param before datetime threshold
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.updatedAt < :before AND c.totalItems > 0 ORDER BY c.updatedAt")
    List<Cart> findAbandonedCarts(@Param("before") LocalDateTime before);
    
    /**
     * Find carts with items
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.totalItems > 0 ORDER BY c.updatedAt DESC")
    List<Cart> findCartsWithItems();
    
    /**
     * Find empty carts
     * @return List<Cart>
     */
    @Query("SELECT c FROM Cart c WHERE c.totalItems = 0 ORDER BY c.updatedAt")
    List<Cart> findEmptyCarts();
    
    /**
     * Count carts by user ID
     * @param userId the user ID
     * @return long count of carts
     */
    @Query("SELECT COUNT(c) FROM Cart c WHERE c.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    /**
     * Delete old empty carts
     * @param before datetime threshold
     * @return number of deleted carts
     */
    @Query("DELETE FROM Cart c WHERE c.totalItems = 0 AND c.updatedAt < :before")
    int deleteOldEmptyCarts(@Param("before") LocalDateTime before);
} 