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
     * Find role by role name
     * @param roleName the role name
     * @return Optional<Role>
     */
    Optional<Role> findByRoleName(String roleName);
    
    /**
     * Check if role exists by role name
     * @param roleName the role name
     * @return boolean
     */
    boolean existsByRoleName(String roleName);
    
    /**
     * Find all roles ordered by role name
     * @return List<Role>
     */
    @Query("SELECT r FROM Role r ORDER BY r.roleName")
    List<Role> findAllOrderedByName();
} 