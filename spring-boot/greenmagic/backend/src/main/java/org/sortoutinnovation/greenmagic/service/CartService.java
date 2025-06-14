package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Cart;
import org.sortoutinnovation.greenmagic.model.CartItem;
import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.repository.CartRepository;
import org.sortoutinnovation.greenmagic.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Cart business logic
 * Handles shopping cart operations and item management
 */
@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    /**
     * Get user's cart
     * @param userId user ID
     * @return Cart
     */
    @Transactional(readOnly = true)
    public Cart getUserCart(Long userId) {
        Optional<Cart> cart = cartRepository.findByUserId(userId);
        return cart.orElse(null);
    }

    /**
     * Get cart items
     * @param cartId cart ID
     * @return List<CartItem>
     */
    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(Long cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    /**
     * Create cart for user
     * @param userId user ID
     * @return Cart
     * @throws RuntimeException if user not found or cart already exists
     */
    public Cart createCart(Long userId) {
        // Check if user already has a cart
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if (existingCart.isPresent()) {
            throw new RuntimeException("User already has a cart");
        }

        // Create user reference
        User user = new User();
        user.setUserId(userId.intValue());

        // Create new cart
        Cart cart = new Cart();
        cart.setUser(user);

        return cartRepository.save(cart);
    }

    /**
     * Add item to cart
     * @param cartId cart ID
     * @param productId product ID
     * @param quantity quantity to add
     * @return CartItem
     * @throws RuntimeException if cart/product not found or insufficient stock
     */
    public CartItem addItemToCart(Long cartId, Long productId, Integer quantity) {
        // Validate cart exists
        Cart cart = cartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));

        // Validate product exists and has sufficient stock
        Product product = productService.getProductById(productId);
        if (!productService.isInStock(productId, quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cartId, productId);
        
        if (existingItem.isPresent()) {
            // Update existing item quantity
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            
            // Check stock for new quantity
            if (!productService.isInStock(productId, newQuantity)) {
                throw new RuntimeException("Insufficient stock for requested quantity");
            }
            
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        } else {
            // Create new cart item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);

            return cartItemRepository.save(cartItem);
        }
    }

    /**
     * Update cart item quantity
     * @param itemId cart item ID
     * @param quantity new quantity
     * @return CartItem
     * @throws RuntimeException if item not found or insufficient stock
     */
    public CartItem updateCartItemQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + itemId));

        // Validate stock
        if (!productService.isInStock(item.getProduct().getProductId().longValue(), quantity)) {
            throw new RuntimeException("Insufficient stock for requested quantity");
        }

        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    /**
     * Remove item from cart
     * @param itemId cart item ID
     * @throws RuntimeException if item not found
     */
    public void removeItemFromCart(Long itemId) {
        if (!cartItemRepository.existsById(itemId)) {
            throw new RuntimeException("Cart item not found with id: " + itemId);
        }
        cartItemRepository.deleteById(itemId);
    }

    /**
     * Clear cart (remove all items)
     * @param cartId cart ID
     * @throws RuntimeException if cart not found
     */
    public void clearCart(Long cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new RuntimeException("Cart not found with id: " + cartId);
        }
        // Delete all cart items for this cart
        List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
        cartItemRepository.deleteAll(cartItems);
    }

    /**
     * Get cart total amount
     * @param cartId cart ID
     * @return BigDecimal total amount
     */
    @Transactional(readOnly = true)
    public BigDecimal getCartTotal(Long cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        return items.stream()
            .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Get cart item count
     * @param cartId cart ID
     * @return Integer total items count
     */
    @Transactional(readOnly = true)
    public Integer getCartItemCount(Long cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        return items.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }

    /**
     * Check if cart is empty
     * @param cartId cart ID
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean isCartEmpty(Long cartId) {
        List<CartItem> items = cartItemRepository.findByCartId(cartId);
        return items.isEmpty();
    }

    /**
     * Get abandoned carts (older than specified days)
     * @param days number of days
     * @return List<Cart>
     */
    @Transactional(readOnly = true)
    public List<Cart> getAbandonedCarts(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        return cartRepository.findOldCarts(cutoffDate);
    }

    /**
     * Clean up abandoned carts
     * @param days number of days to consider as abandoned
     * @return int number of carts cleaned up
     */
    public int cleanupAbandonedCarts(int days) {
        List<Cart> abandonedCarts = getAbandonedCarts(days);
        
        for (Cart cart : abandonedCarts) {
            clearCart(cart.getCartId().longValue());
            cartRepository.delete(cart);
        }
        
        return abandonedCarts.size();
    }

    /**
     * Merge guest cart with user cart
     * @param guestCartId guest cart ID
     * @param userId user ID
     * @return Cart merged cart
     */
    public Cart mergeGuestCart(Long guestCartId, Long userId) {
        // Get or create user cart
        Cart userCart = getUserCart(userId);
        if (userCart == null) {
            userCart = createCart(userId);
        }

        // Get guest cart items
        List<CartItem> guestItems = getCartItems(guestCartId);

        // Merge items
        for (CartItem guestItem : guestItems) {
            try {
                addItemToCart(userCart.getCartId().longValue(), 
                    guestItem.getProduct().getProductId().longValue(), 
                    guestItem.getQuantity());
            } catch (RuntimeException e) {
                // Skip items that can't be added (out of stock, etc.)
                continue;
            }
        }

        // Delete guest cart
        clearCart(guestCartId);
        cartRepository.deleteById(guestCartId);

        return userCart;
    }

    /**
     * Validate cart before checkout
     * @param cartId cart ID
     * @return boolean true if cart is valid for checkout
     * @throws RuntimeException if validation fails
     */
    @Transactional(readOnly = true)
    public boolean validateCartForCheckout(Long cartId) {
        List<CartItem> items = getCartItems(cartId);
        
        if (items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Check stock availability for all items
        for (CartItem item : items) {
            if (!productService.isInStock(item.getProduct().getProductId().longValue(), item.getQuantity())) {
                throw new RuntimeException("Product out of stock: " + item.getProduct().getName());
            }
        }

        return true;
    }
} 