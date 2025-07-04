package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.ProductCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductResponseDto;
import org.sortoutinnovation.greenmagic.dto.ProductUpdateRequestDto;
import org.sortoutinnovation.greenmagic.mapper.ProductMapper;
import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Product management operations
 * Provides endpoints for product CRUD operations and search functionality
 */
@RestController
@RequestMapping("/products")
@Validated
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Create a new product
     * POST /api/products
     */
    @PostMapping
    public ResponseEntity<ApiResponseDto<Product>> createProduct(@Valid @RequestBody Product product) {
        try {
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product created successfully", savedProduct));
                
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
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
    public ResponseEntity<ApiResponseDto<Page<Product>>> getAllActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productService.getAllActiveProducts(pageable);
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
    public ResponseEntity<ApiResponseDto<Product>> getProductById(@PathVariable Integer id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product found", product));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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
            Product product = productService.getProductBySku(sku);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product found", product));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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
            Page<Product> products = productService.searchProductsByName(name, pageable);
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
            @PathVariable Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productService.getProductsByCategory(categoryId, pageable);
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
            Page<Product> products = productService.getFeaturedProducts(pageable);
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
            Page<Product> products = productService.getProductsOnSale(pageable);
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
            @PathVariable Integer id,
            @Valid @RequestBody Product product) {
        
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product updated successfully", updatedProduct));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product: " + e.getMessage(), null));
        }
    }

    /**
     * Delete product (soft delete)
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product deleted successfully", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete product: " + e.getMessage(), null));
        }
    }

    /**
     * Get products by price range
     * GET /api/products/price-range
     */
    @GetMapping("/price-range")
    public ResponseEntity<ApiResponseDto<Page<Product>>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    /**
     * Get products by brand
     * GET /api/products/brand/{brand}
     */
    @GetMapping("/brand/{brand}")
    public ResponseEntity<ApiResponseDto<Page<Product>>> getProductsByBrand(
            @PathVariable String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productService.getProductsByBrand(brand, pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products retrieved successfully", products));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }


} 