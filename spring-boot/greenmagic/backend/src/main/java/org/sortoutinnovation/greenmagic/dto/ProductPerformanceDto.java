package org.sortoutinnovation.greenmagic.dto;

import java.time.LocalDateTime;

/**
 * DTO for product performance metrics
 */
public class ProductPerformanceDto {
    private Integer productId;
    private String productName;
    private Integer salesCount;
    private Integer previousSalesCount;
    private String salesTrend;
    private Integer viewCount;
    private Integer addToCartCount;
    private Double conversionRate;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime lastUpdated;

    public ProductPerformanceDto() {
    }

    public ProductPerformanceDto(Integer productId, String productName) {
        this.productId = productId;
        this.productName = productName;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Integer salesCount) {
        this.salesCount = salesCount;
    }

    public Integer getPreviousSalesCount() {
        return previousSalesCount;
    }

    public void setPreviousSalesCount(Integer previousSalesCount) {
        this.previousSalesCount = previousSalesCount;
    }

    public String getSalesTrend() {
        return salesTrend;
    }

    public void setSalesTrend(String salesTrend) {
        this.salesTrend = salesTrend;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getAddToCartCount() {
        return addToCartCount;
    }

    public void setAddToCartCount(Integer addToCartCount) {
        this.addToCartCount = addToCartCount;
    }

    public Double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(Double conversionRate) {
        this.conversionRate = conversionRate;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
} 