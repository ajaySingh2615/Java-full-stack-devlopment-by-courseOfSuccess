package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.UserRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.Map;

/**
 * Authentication Controller
 * Handles user login and authentication endpoints
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    /**
     * Debug endpoint to check admin user existence
     * @return admin user info if exists
     */
    @GetMapping("/debug/admin")
    public ResponseEntity<?> checkAdminUser() {
        try {
            // This is a debug endpoint - remove in production
            UserResponseDto admin = userService.getUserByEmail("admin@greenmagic.com");
            return ResponseEntity.ok(Map.of(
                "message", "Admin user found",
                "user", admin
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of(
                "message", "Admin user not found",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * User login endpoint
     * @param loginRequest containing email and password
     * @param request HTTP servlet request for session management
     * @param response HTTP servlet response for session management
     * @return UserResponseDto if authentication successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, 
                                 HttpServletRequest request, 
                                 HttpServletResponse response) {
        try {
            // Authenticate user credentials
            UserResponseDto user = userService.authenticateUser(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            );
            
            // Create Spring Security Authentication object
            String roleName = "ROLE_" + user.getRoleName(); // Spring Security expects ROLE_ prefix
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);
            
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), // principal
                null, // credentials (don't store password)
                Collections.singletonList(authority) // authorities
            );
            
            // Set authentication in SecurityContext
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authentication);
            
            // Ensure session is created
            request.getSession(true);
            
            // Save authentication to session
            securityContextRepository.saveContext(context, request, response);
            
            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Authentication failed",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Password change endpoint
     * @param userId user ID
     * @param passwordChangeRequest containing current and new passwords
     * @return success message
     */
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        try {
            UserResponseDto user = userService.updatePassword(
                userId,
                passwordChangeRequest.getCurrentPassword(),
                passwordChangeRequest.getNewPassword()
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Password updated successfully",
                "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Password change failed",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Admin password reset endpoint
     * @param userId user ID to reset password for
     * @param passwordResetRequest containing new password
     * @return success message
     */
    @PutMapping("/admin/users/{userId}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long userId,
            @Valid @RequestBody PasswordResetRequest passwordResetRequest) {
        try {
            UserResponseDto user = userService.resetPassword(
                userId,
                passwordResetRequest.getNewPassword()
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Password reset successfully",
                "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Password reset failed",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Manual endpoint to create admin user for debugging
     * @return creation result
     */
    @PostMapping("/debug/create-admin")
    public ResponseEntity<?> createAdminUser() {
        try {
            // Check if admin user already exists
            try {
                UserResponseDto existingAdmin = userService.getUserByEmail("admin@greenmagic.com");
                return ResponseEntity.ok(Map.of(
                    "message", "Admin user already exists",
                    "user", existingAdmin
                ));
            } catch (Exception e) {
                // Admin doesn't exist, create it
            }
            
            // Create admin user manually
            UserRegistrationRequestDto adminRequest = new UserRegistrationRequestDto();
            adminRequest.setName("Admin User");
            adminRequest.setEmail("admin@greenmagic.com");
            adminRequest.setPassword("Admin123!"); // Meets password requirements
            adminRequest.setPhoneNumber("+1234567890"); // Required field
            adminRequest.setRole("USER"); // We'll change this to ADMIN after creation
            
            // Register user first as USER, then we'll need to update role to ADMIN
            UserResponseDto createdAdmin = userService.registerUser(adminRequest);
            
            return ResponseEntity.ok(Map.of(
                "message", "Admin user created successfully (Note: Role needs to be updated to ADMIN manually)",
                "user", createdAdmin
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "message", "Failed to create admin user"
            ));
        }
    }

    /**
     * Manual endpoint to update user role to ADMIN for debugging
     * @param userId user ID to update
     * @return update result
     */
    @PostMapping("/debug/make-admin/{userId}")
    public ResponseEntity<?> makeUserAdmin(@PathVariable Long userId) {
        try {
            UserResponseDto updatedUser = userService.updateUserRole(userId, "ADMIN");
            
            return ResponseEntity.ok(Map.of(
                "message", "User role updated to ADMIN successfully",
                "user", updatedUser
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "message", "Failed to update user role"
            ));
        }
    }

    /**
     * Debug endpoint to check current user authentication status
     * @return current user authentication info
     */
    @GetMapping("/debug/current-user")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.ok(Map.of(
                    "message", "No authentication found",
                    "authenticated", false
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Authentication found",
                "authenticated", true,
                "principal", authentication.getPrincipal(),
                "authorities", authentication.getAuthorities().toString(),
                "name", authentication.getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "message", "Error checking authentication",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Login request DTO
     */
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    /**
     * Password change request DTO
     */
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        // Getters and setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    /**
     * Password reset request DTO
     */
    public static class PasswordResetRequest {
        private String newPassword;

        // Getters and setters
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
} 