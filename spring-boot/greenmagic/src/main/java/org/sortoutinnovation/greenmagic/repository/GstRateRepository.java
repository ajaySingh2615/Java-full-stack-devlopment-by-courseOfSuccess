package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.GstRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for GstRate entity operations
 * Provides CRUD operations and custom queries for GST rate management
 */
@Repository
public interface GstRateRepository extends JpaRepository<GstRate, Long> {
    
    /**
     * Find GST rate by rate value
     * @param rate the GST rate value
     * @return Optional<GstRate>
     */
    Optional<GstRate> findByRate(BigDecimal rate);
    
    /**
     * Find GST rate by category
     * @param category the GST rate category
     * @return Optional<GstRate>
     */
    Optional<GstRate> findByCategory(String category);
    
    /**
     * Check if GST rate exists by rate value
     * @param rate the GST rate value
     * @return boolean
     */
    boolean existsByRate(BigDecimal rate);
    
    /**
     * Check if GST rate exists by category
     * @param category the GST rate category
     * @return boolean
     */
    boolean existsByCategory(String category);
    
    /**
     * Find all active GST rates
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g WHERE g.isActive = true ORDER BY g.rate")
    List<GstRate> findAllActiveGstRates();
    
    /**
     * Find GST rates by rate range
     * @param minRate minimum rate
     * @param maxRate maximum rate
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g WHERE g.isActive = true AND g.rate BETWEEN :minRate AND :maxRate ORDER BY g.rate")
    List<GstRate> findByRateRange(@Param("minRate") BigDecimal minRate, @Param("maxRate") BigDecimal maxRate);
    
    /**
     * Find GST rates by description containing (case insensitive)
     * @param description the description to search
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g WHERE g.isActive = true AND LOWER(g.description) LIKE LOWER(CONCAT('%', :description, '%')) ORDER BY g.rate")
    List<GstRate> findByDescriptionContaining(@Param("description") String description);
} 