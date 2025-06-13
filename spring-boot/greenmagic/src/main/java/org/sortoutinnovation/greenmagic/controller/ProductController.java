package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.repository.ProductRepository;
import org.sortoutinnovation.greenmagic.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Product management operations
 * Provides endpoints for product CRUD, search, and filtering
 */
@RestController
@RequestMapping("/api/products")
@Validated
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Create a new product
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<ApiResponseDto<Product>> createProduct(@RequestBody Product product) {
        try {
            // Check if SKU already exists
            if (product.getSku() != null && productRepository.existsBySku(product.getSku())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "SKU already exists", null));
            }
            
            // Check if slug already exists
            if (product.getSlug() != null && productRepository.existsBySlug(product.getSlug())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "Slug already exists", null));
            }

            // Set default status if not provided
            if (product.getStatus() == null) {
                product.setStatus(Product.ProductStatus.ACTIVE);
            }

            Product savedProduct = productRepository.save(product);

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product created successfully", savedProduct));
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create product: " + e.getMessage(), null));
        }
    }

    /**
     * Get all active products with pagination
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<ApiResponseDto<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productRepository.findAllActiveProducts(pageable);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    /**
     * Get product by ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Product>> getProductById(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            
            if (productOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product found", productOpt.get()));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product: " + e.getMessage(), null));
        }
    }

    /**
     * Get product by SKU
     * GET /api/products/sku/{sku}
     */
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponseDto<Product>> getProductBySku(@PathVariable String sku) {
        try {
            Optional<Product> productOpt = productRepository.findBySku(sku);
            
            if (productOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product found", productOpt.get()));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product: " + e.getMessage(), null));
        }
    }

    /**
     * Search products by name
     * GET /api/products/search
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponseDto<Page<Product>>> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productRepository.findByNameContaining(name, pageable);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products found", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to search products: " + e.getMessage(), null));
        }
    }

    /**
     * Get products by category
     * GET /api/products/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponseDto<Page<Product>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    /**
     * Get featured products
     * GET /api/products/featured
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponseDto<Page<Product>>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productRepository.findFeaturedProducts(pageable);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Featured products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve featured products: " + e.getMessage(), null));
        }
    }

    /**
     * Get products on sale
     * GET /api/products/sale
     */
    @GetMapping("/sale")
    public ResponseEntity<ApiResponseDto<Page<Product>>> getProductsOnSale(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productRepository.findProductsOnSale(pageable);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Sale products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve sale products: " + e.getMessage(), null));
        }
    }

    /**
     * Update product
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productRequest) {
        
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            
            if (productOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOpt.get();
            
            // Check if SKU is being changed and if new SKU already exists
            if (productRequest.getSku() != null && 
                !product.getSku().equals(productRequest.getSku()) && 
                productRepository.existsBySku(productRequest.getSku())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "SKU already exists", null));
            }

            // Update product fields
            if (productRequest.getName() != null) product.setName(productRequest.getName());
            if (productRequest.getSku() != null) product.setSku(productRequest.getSku());
            if (productRequest.getSlug() != null) product.setSlug(productRequest.getSlug());
            if (productRequest.getDescription() != null) product.setDescription(productRequest.getDescription());
            if (productRequest.getShortDescription() != null) product.setShortDescription(productRequest.getShortDescription());
            if (productRequest.getPrice() != null) product.setPrice(productRequest.getPrice());
            if (productRequest.getRegularPrice() != null) product.setRegularPrice(productRequest.getRegularPrice());
            if (productRequest.getQuantity() != null) product.setQuantity(productRequest.getQuantity());
            if (productRequest.getBrand() != null) product.setBrand(productRequest.getBrand());

            Product updatedProduct = productRepository.save(product);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product updated successfully", updatedProduct));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product: " + e.getMessage(), null));
        }
    }

    /**
     * Delete product (soft delete by changing status)
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProduct(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productRepository.findById(id);
            
            if (productOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOpt.get();
            product.setStatus(Product.ProductStatus.INACTIVE);
            productRepository.save(product);

            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product deleted successfully", null));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete product: " + e.getMessage(), null));
        }
    }
} 