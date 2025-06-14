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
     * Find GST rate by percentage value
     * @param percentage the GST percentage value
     * @return Optional<GstRate>
     */
    Optional<GstRate> findByPercentage(BigDecimal percentage);
    
    /**
     * Find GST rate by rate name
     * @param rateName the GST rate name
     * @return Optional<GstRate>
     */
    Optional<GstRate> findByRateName(String rateName);
    
    /**
     * Check if GST rate exists by percentage value
     * @param percentage the GST percentage value
     * @return boolean
     */
    boolean existsByPercentage(BigDecimal percentage);
    
    /**
     * Check if GST rate exists by rate name
     * @param rateName the GST rate name
     * @return boolean
     */
    boolean existsByRateName(String rateName);
    
    /**
     * Find all GST rates ordered by percentage
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g ORDER BY g.percentage")
    List<GstRate> findAllOrderByPercentage();
    
    /**
     * Find GST rates by percentage range
     * @param minPercentage minimum percentage
     * @param maxPercentage maximum percentage
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g WHERE g.percentage BETWEEN :minPercentage AND :maxPercentage ORDER BY g.percentage")
    List<GstRate> findByPercentageRange(@Param("minPercentage") BigDecimal minPercentage, @Param("maxPercentage") BigDecimal maxPercentage);
    
    /**
     * Find GST rates by description containing (case insensitive)
     * @param description the description to search
     * @return List<GstRate>
     */
    @Query("SELECT g FROM GstRate g WHERE LOWER(g.description) LIKE LOWER(CONCAT('%', :description, '%')) ORDER BY g.percentage")
    List<GstRate> findByDescriptionContaining(@Param("description") String description);
} 