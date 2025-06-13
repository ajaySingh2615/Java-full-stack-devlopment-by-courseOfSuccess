package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.HsnCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for HsnCode entity operations
 * Provides CRUD operations and custom queries for HSN code management
 */
@Repository
public interface HsnCodeRepository extends JpaRepository<HsnCode, Long> {
    
    /**
     * Find HSN code by code value
     * @param code the HSN code value
     * @return Optional<HsnCode>
     */
    Optional<HsnCode> findByCode(String code);
    
    /**
     * Check if HSN code exists by code value
     * @param code the HSN code value
     * @return boolean
     */
    boolean existsByCode(String code);
    
    /**
     * Find all active HSN codes
     * @return List<HsnCode>
     */
    @Query("SELECT h FROM HsnCode h WHERE h.isActive = true ORDER BY h.code")
    List<HsnCode> findAllActiveHsnCodes();
    
    /**
     * Find HSN codes by chapter
     * @param chapter the HSN chapter
     * @return List<HsnCode>
     */
    @Query("SELECT h FROM HsnCode h WHERE h.isActive = true AND h.chapter = :chapter ORDER BY h.code")
    List<HsnCode> findByChapter(@Param("chapter") String chapter);
    
    /**
     * Find HSN codes by description containing (case insensitive)
     * @param description the description to search
     * @return List<HsnCode>
     */
    @Query("SELECT h FROM HsnCode h WHERE h.isActive = true AND LOWER(h.description) LIKE LOWER(CONCAT('%', :description, '%')) ORDER BY h.code")
    List<HsnCode> findByDescriptionContaining(@Param("description") String description);
    
    /**
     * Find HSN codes by code starting with
     * @param prefix the code prefix
     * @return List<HsnCode>
     */
    @Query("SELECT h FROM HsnCode h WHERE h.isActive = true AND h.code LIKE CONCAT(:prefix, '%') ORDER BY h.code")
    List<HsnCode> findByCodeStartingWith(@Param("prefix") String prefix);
    
    /**
     * Find HSN codes with GST rate
     * @return List<HsnCode>
     */
    @Query("SELECT h FROM HsnCode h WHERE h.isActive = true AND h.gstRate IS NOT NULL ORDER BY h.code")
    List<HsnCode> findHsnCodesWithGstRate();
} 