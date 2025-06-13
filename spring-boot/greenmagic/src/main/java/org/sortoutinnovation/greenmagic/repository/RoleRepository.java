package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Role entity operations
 * Provides CRUD operations and custom queries for role management
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    /**
     * Find role by name
     * @param name the role name
     * @return Optional<Role>
     */
    Optional<Role> findByName(String name);
    
    /**
     * Check if role exists by name
     * @param name the role name
     * @return boolean
     */
    boolean existsByName(String name);
    
    /**
     * Find all active roles
     * @return List<Role>
     */
    @Query("SELECT r FROM Role r WHERE r.isActive = true ORDER BY r.name")
    List<Role> findAllActiveRoles();
} 