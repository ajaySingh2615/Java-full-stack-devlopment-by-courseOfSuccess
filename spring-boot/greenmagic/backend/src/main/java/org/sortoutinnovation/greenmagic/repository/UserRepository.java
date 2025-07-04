package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Role;
import org.sortoutinnovation.greenmagic.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity operations
 * Provides CRUD operations and custom queries for user management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    /**
     * Find user by email
     * @param email the user email
     * @return Optional<User>
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by phone number
     * @param phoneNumber the user phone number
     * @return Optional<User>
     */
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    /**
     * Find user by Google ID
     * @param googleId the Google OAuth ID
     * @return Optional<User>
     */
    Optional<User> findByGoogleId(String googleId);
    
    /**
     * Check if user exists by email
     * @param email the user email
     * @return boolean
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if user exists by phone number
     * @param phoneNumber the user phone number
     * @return boolean
     */
    boolean existsByPhoneNumber(String phoneNumber);
    
    /**
     * Check if user exists by Google ID
     * @param googleId the Google OAuth ID
     * @return boolean
     */
    boolean existsByGoogleId(String googleId);
    
    /**
     * Check if user exists by role
     * @param role the role
     * @return boolean
     */
    boolean existsByRole(Role role);
    
    /**
     * Find all users ordered by name
     * @return List<User>
     */
    @Query("SELECT u FROM User u ORDER BY u.name")
    List<User> findAllUsers();
    
    /**
     * Find users by role
     * @param roleName the role name
     * @return List<User>
     */
    @Query("SELECT u FROM User u WHERE u.role.roleName = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    /**
     * Find users by name containing (case insensitive)
     * @param name the name to search
     * @param pageable pagination information
     * @return Page<User>
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<User> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    /**
     * Find users created today
     * @return List<User>
     */
    @Query("SELECT u FROM User u WHERE DATE(u.createdAt) = CURRENT_DATE")
    List<User> findUsersCreatedToday();
} 