package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Role;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.repository.RoleRepository;
import org.sortoutinnovation.greenmagic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Role business logic
 * Handles role creation, retrieval, and management
 */
@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Initialize default roles and admin user on application startup
     */
    @PostConstruct
    public void initializeDefaultRoles() {
        createRoleIfNotExists("USER");
        createRoleIfNotExists("VENDOR");
        createRoleIfNotExists("ADMIN");
        
        // Create default admin user if none exists
        createDefaultAdminUser();
    }

    /**
     * Create default admin user if none exists
     */
    private void createDefaultAdminUser() {
        try {
            // Check if any admin user exists
            Role adminRole = getRoleByName("ADMIN");
            boolean adminExists = userRepository.existsByRole(adminRole);
            
            if (!adminExists) {
                User adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setEmail("admin@greenmagic.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole(adminRole);
                
                userRepository.save(adminUser);
                System.out.println("=== DEFAULT ADMIN USER CREATED ===");
                System.out.println("Email: admin@greenmagic.com");
                System.out.println("Password: admin123");
                System.out.println("Please change the password after first login!");
                System.out.println("===================================");
            } else {
                System.out.println("Admin user already exists, skipping creation.");
            }
        } catch (Exception e) {
            System.err.println("Error creating default admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Create role if it doesn't exist
     * @param roleName role name
     */
    private void createRoleIfNotExists(String roleName) {
        if (!roleRepository.existsByRoleName(roleName)) {
            Role role = new Role(roleName);
            roleRepository.save(role);
        }
    }

    /**
     * Get role by name
     * @param roleName role name
     * @return Role
     * @throws RuntimeException if role not found
     */
    @Transactional(readOnly = true)
    public Role getRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName)
            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
    }

    /**
     * Get all roles
     * @return List<Role>
     */
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAllOrderedByName();
    }

    /**
     * Check if role exists
     * @param roleName role name
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean roleExists(String roleName) {
        return roleRepository.existsByRoleName(roleName);
    }

    /**
     * Create new role
     * @param roleName role name
     * @return Role
     * @throws RuntimeException if role already exists
     */
    public Role createRole(String roleName) {
        if (roleRepository.existsByRoleName(roleName)) {
            throw new RuntimeException("Role already exists: " + roleName);
        }
        
        Role role = new Role(roleName);
        return roleRepository.save(role);
    }

    /**
     * Get default user role
     * @return Role
     */
    @Transactional(readOnly = true)
    public Role getDefaultUserRole() {
        return getRoleByName("USER");
    }

    /**
     * Get vendor role
     * @return Role
     */
    @Transactional(readOnly = true)
    public Role getVendorRole() {
        return getRoleByName("VENDOR");
    }

    /**
     * Get admin role
     * @return Role
     */
    @Transactional(readOnly = true)
    public Role getAdminRole() {
        return getRoleByName("ADMIN");
    }
} 