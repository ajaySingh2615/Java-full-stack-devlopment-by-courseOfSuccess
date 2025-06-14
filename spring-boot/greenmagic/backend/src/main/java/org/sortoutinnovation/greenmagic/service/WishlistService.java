package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Wishlist;
import org.sortoutinnovation.greenmagic.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class for Wishlist business logic
 * Handles user wishlist operations
 */
@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    /**
     * Get user's wishlist
     * @param userId user ID
     * @return List<Wishlist>
     */
    @Transactional(readOnly = true)
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    /**
     * Add product to wishlist
     * @param userId user ID
     * @param productId product ID
     * @return Wishlist
     * @throws RuntimeException if product already in wishlist
     */
    public Wishlist addToWishlist(Long userId, Long productId) {
        // Check if product already in wishlist
        if (wishlistRepository.existsByUserUserIdAndProductProductId(userId, productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        // Note: You'll need to set user and product objects here
        // This is a simplified version
        return wishlistRepository.save(wishlist);
    }

    /**
     * Remove product from wishlist
     * @param userId user ID
     * @param productId product ID
     * @throws RuntimeException if item not found in wishlist
     */
    public void removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new RuntimeException("Product not found in wishlist"));
        
        wishlistRepository.delete(wishlist);
    }

    /**
     * Get wishlist count for user
     * @param userId user ID
     * @return Long wishlist count
     */
    @Transactional(readOnly = true)
    public Long getWishlistCount(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }

    /**
     * Get wishlist count for product
     * @param productId product ID
     * @return Long wishlist count
     */
    @Transactional(readOnly = true)
    public Long getProductWishlistCount(Long productId) {
        return wishlistRepository.countByProductId(productId);
    }

    /**
     * Check if product is in user's wishlist
     * @param userId user ID
     * @param productId product ID
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserUserIdAndProductProductId(userId, productId);
    }

    /**
     * Clear user's wishlist
     * @param userId user ID
     */
    public void clearWishlist(Long userId) {
        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
        wishlistRepository.deleteAll(wishlistItems);
    }
} 