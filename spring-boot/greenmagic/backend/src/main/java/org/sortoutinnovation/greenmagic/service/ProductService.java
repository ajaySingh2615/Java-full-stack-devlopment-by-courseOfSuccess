package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Product business logic
 * Handles product management, inventory, and search operations
 */
@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Create a new product
     * @param product product data
     * @return Product
     * @throws RuntimeException if SKU already exists
     */
    public Product createProduct(Product product) {
        // Validate unique SKU
        if (product.getSku() != null && productRepository.existsBySku(product.getSku())) {
            throw new RuntimeException("Product with SKU already exists: " + product.getSku());
        }

        // Set default status if not provided
        if (product.getStatus() == null) {
            product.setStatus(Product.ProductStatus.ACTIVE);
        }

        // Generate URL slug from name if not provided
        if (product.getUrlSlug() == null || product.getUrlSlug().isEmpty()) {
            product.setUrlSlug(generateSlug(product.getName()));
        }

        return productRepository.save(product);
    }

    /**
     * Get all active products with pagination
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getAllActiveProducts(Pageable pageable) {
        return productRepository.findAllActiveProducts(pageable);
    }

    /**
     * Get product by ID
     * @param id product ID
     * @return Product
     * @throws RuntimeException if product not found
     */
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    /**
     * Get product by SKU
     * @param sku product SKU
     * @return Product
     * @throws RuntimeException if product not found
     */
    @Transactional(readOnly = true)
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
            .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }

    /**
     * Get product by URL slug
     * @param urlSlug product URL slug
     * @return Product
     * @throws RuntimeException if product not found
     */
    @Transactional(readOnly = true)
    public Product getProductByUrlSlug(String urlSlug) {
        return productRepository.findByUrlSlug(urlSlug)
            .orElseThrow(() -> new RuntimeException("Product not found with URL slug: " + urlSlug));
    }

    /**
     * Search products by name
     * @param name search term
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> searchProductsByName(String name, Pageable pageable) {
        return productRepository.findByNameContaining(name, pageable);
    }

    /**
     * Get products by category
     * @param categoryId category ID
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    /**
     * Get featured products (replaced with products in stock)
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getFeaturedProducts(Pageable pageable) {
        return productRepository.findProductsInStock(pageable);
    }

    /**
     * Get products on sale (replaced with products in stock)
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsOnSale(Pageable pageable) {
        return productRepository.findProductsInStock(pageable);
    }

    /**
     * Get products by price range
     * @param minPrice minimum price
     * @param maxPrice maximum price
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
    }

    /**
     * Get products by brand
     * @param brand brand name
     * @param pageable pagination information
     * @return Page<Product>
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByBrand(String brand, Pageable pageable) {
        return productRepository.findByBrand(brand, pageable);
    }

    /**
     * Get low stock products
     * @param threshold stock threshold
     * @return List<Product>
     */
    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold);
    }

    /**
     * Get out of stock products
     * @return List<Product>
     */
    @Transactional(readOnly = true)
    public List<Product> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }

    /**
     * Update product
     * @param id product ID
     * @param updatedProduct updated product data
     * @return Product
     * @throws RuntimeException if product not found or SKU conflict
     */
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Check SKU uniqueness if being changed
        if (updatedProduct.getSku() != null && 
            !existingProduct.getSku().equals(updatedProduct.getSku()) &&
            productRepository.existsBySku(updatedProduct.getSku())) {
            throw new RuntimeException("Product with SKU already exists: " + updatedProduct.getSku());
        }

        // Update fields
        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName());
        }
        if (updatedProduct.getDescription() != null) {
            existingProduct.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getPrice() != null) {
            existingProduct.setPrice(updatedProduct.getPrice());
        }
        if (updatedProduct.getMrp() != null) {
            existingProduct.setMrp(updatedProduct.getMrp());
        }
        if (updatedProduct.getSku() != null) {
            existingProduct.setSku(updatedProduct.getSku());
        }
        if (updatedProduct.getQuantity() != null) {
            existingProduct.setQuantity(updatedProduct.getQuantity());
        }
        if (updatedProduct.getBrand() != null) {
            existingProduct.setBrand(updatedProduct.getBrand());
        }
        if (updatedProduct.getWeightForShipping() != null) {
            existingProduct.setWeightForShipping(updatedProduct.getWeightForShipping());
        }
        if (updatedProduct.getDimensions() != null) {
            existingProduct.setDimensions(updatedProduct.getDimensions());
        }
        if (updatedProduct.getImageUrl() != null) {
            existingProduct.setImageUrl(updatedProduct.getImageUrl());
        }
        // Note: isFeatured removed as it's business logic, not product data
        // Use separate business logic service for featured product management
        if (updatedProduct.getStatus() != null) {
            existingProduct.setStatus(updatedProduct.getStatus());
        }
        if (updatedProduct.getCategory() != null) {
            existingProduct.setCategory(updatedProduct.getCategory());
        }

        return productRepository.save(existingProduct);
    }

    /**
     * Soft delete product (set status to INACTIVE)
     * @param id product ID
     * @throws RuntimeException if product not found
     */
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setStatus(Product.ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    /**
     * Update product stock
     * @param id product ID
     * @param quantity new quantity
     * @return Product
     * @throws RuntimeException if product not found
     */
    public Product updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setQuantity(quantity);
        return productRepository.save(product);
    }

    /**
     * Reduce product stock (for order processing)
     * @param id product ID
     * @param quantity quantity to reduce
     * @return Product
     * @throws RuntimeException if product not found or insufficient stock
     */
    public Product reduceStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }
        
        product.setQuantity(product.getQuantity() - quantity);
        return productRepository.save(product);
    }

    /**
     * Check if product is in stock
     * @param id product ID
     * @param quantity required quantity
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean isInStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id).orElse(null);
        return product != null && product.getQuantity() >= quantity;
    }

    /**
     * Get product stock quantity
     * @param id product ID
     * @return Integer stock quantity
     * @throws RuntimeException if product not found
     */
    @Transactional(readOnly = true)
    public Integer getStockQuantity(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return product.getQuantity();
    }

    /**
     * Generate slug from product name
     * @param name product name
     * @return slug
     */
    private String generateSlug(String name) {
        return name.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .trim();
    }
} 