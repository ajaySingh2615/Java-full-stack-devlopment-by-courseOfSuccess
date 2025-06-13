package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Address entity operations
 * Provides CRUD operations and custom queries for address management
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    /**
     * Find addresses by user ID
     * @param userId the user ID
     * @return List<Address>
     */
    @Query("SELECT a FROM Address a WHERE a.user.userId = :userId ORDER BY a.isDefault DESC, a.createdAt DESC")
    List<Address> findByUserId(@Param("userId") Long userId);
    
    /**
     * Find default address by user ID
     * @param userId the user ID
     * @return Optional<Address>
     */
    @Query("SELECT a FROM Address a WHERE a.user.userId = :userId AND a.isDefault = true")
    Optional<Address> findDefaultAddressByUserId(@Param("userId") Long userId);
    
    /**
     * Find addresses by user ID and address type
     * @param userId the user ID
     * @param addressType the address type
     * @return List<Address>
     */
    @Query("SELECT a FROM Address a WHERE a.user.userId = :userId AND a.addressType = :addressType ORDER BY a.isDefault DESC, a.createdAt DESC")
    List<Address> findByUserIdAndAddressType(@Param("userId") Long userId, @Param("addressType") Address.AddressType addressType);
    
    /**
     * Find addresses by city
     * @param city the city name
     * @return List<Address>
     */
    @Query("SELECT a FROM Address a WHERE LOWER(a.city) = LOWER(:city) ORDER BY a.createdAt DESC")
    List<Address> findByCity(@Param("city") String city);
    
    /**
     * Find addresses by state
     * @param state the state name
     * @return List<Address>
     */
    @Query("SELECT a FROM Address a WHERE LOWER(a.state) = LOWER(:state) ORDER BY a.city, a.createdAt DESC")
    List<Address> findByState(@Param("state") String state);
    
    /**
     * Find addresses by zip code
     * @param zipCode the zip code
     * @return List<Address>
     */
    @Query("SELECT a FROM Address a WHERE a.zipCode = :zipCode ORDER BY a.createdAt DESC")
    List<Address> findByZipCode(@Param("zipCode") String zipCode);
    
    /**
     * Count addresses by user ID
     * @param userId the user ID
     * @return long count of addresses
     */
    @Query("SELECT COUNT(a) FROM Address a WHERE a.user.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    /**
     * Check if user has default address
     * @param userId the user ID
     * @return boolean
     */
    @Query("SELECT COUNT(a) > 0 FROM Address a WHERE a.user.userId = :userId AND a.isDefault = true")
    boolean hasDefaultAddress(@Param("userId") Long userId);
} 