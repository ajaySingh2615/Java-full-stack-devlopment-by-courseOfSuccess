package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.VendorProfile;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for VendorProfile entity operations
 * Provides CRUD operations and custom queries for vendor management
 */
@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, Integer> {
    
    /**
     * Find vendor profile by associated user
     * @param user the user entity
     * @return Optional<VendorProfile>
     */
    Optional<VendorProfile> findByUser(User user);
    
    /**
     * Find vendor profile by user ID
     * @param userId the user ID
     * @return Optional<VendorProfile>
     */
    @Query("SELECT v FROM VendorProfile v WHERE v.user.userId = :userId")
    Optional<VendorProfile> findByUserId(@Param("userId") Integer userId);
    
    /**
     * Find vendor profiles by status
     * @param status the vendor status
     * @return List<VendorProfile>
     */
    List<VendorProfile> findByStatus(VendorStatus status);
    
    /**
     * Find vendor profiles by status with pagination
     * @param status the vendor status
     * @param pageable pagination information
     * @return Page<VendorProfile>
     */
    Page<VendorProfile> findByStatus(VendorStatus status, Pageable pageable);
    
    /**
     * Find vendor profiles by business name containing (case insensitive)
     * @param businessName the business name to search
     * @param pageable pagination information
     * @return Page<VendorProfile>
     */
    @Query("SELECT v FROM VendorProfile v WHERE LOWER(v.businessName) LIKE LOWER(CONCAT('%', :businessName, '%'))")
    Page<VendorProfile> findByBusinessNameContaining(@Param("businessName") String businessName, Pageable pageable);
    
    /**
     * Check if vendor profile exists by GST number
     * @param gstNumber the GST number
     * @return boolean
     */
    boolean existsByGstNumber(String gstNumber);
    
    /**
     * Count vendor profiles by status
     * @param status the vendor status
     * @return long
     */
    long countByStatus(VendorStatus status);
} 