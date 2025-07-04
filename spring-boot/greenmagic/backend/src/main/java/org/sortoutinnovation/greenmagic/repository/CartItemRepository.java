package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = :cartId")
    List<CartItem> findByCartId(@Param("cartId") Integer cartId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.userId = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.cartId = :cartId AND ci.product.productId = :productId")
    Optional<CartItem> findByCartIdAndProductId(@Param("cartId") Integer cartId, @Param("productId") Integer productId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.product.productId = :productId")
    List<CartItem> findByProductId(@Param("productId") Integer productId);
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.cartId = :cartId")
    long countByCartId(@Param("cartId") Integer cartId);
} 