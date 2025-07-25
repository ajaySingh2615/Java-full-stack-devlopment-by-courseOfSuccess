package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.*;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.service.UserService;
import org.sortoutinnovation.greenmagic.service.VendorProfileService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Authentication Controller
 * Handles user login and authentication endpoints
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private VendorProfileService vendorProfileService;

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
     * Register a new customer user
     * @param requestDto registration data
     * @return newly created user
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody UserRegistrationRequestDto requestDto) {
        try {
            UserResponseDto user = userService.registerCustomer(requestDto);
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Registration failed",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Register a new vendor (step 1)
     * @param requestDto vendor registration data
     * @return newly created vendor user
     */
    @PostMapping("/vendor-register")
    public ResponseEntity<?> registerVendor(@Valid @RequestBody VendorRegistrationRequestDto requestDto) {
        try {
            // Validate terms acceptance
            if (!requestDto.getTermsAccepted()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Registration failed",
                    "message", "You must accept the terms and conditions"
                ));
            }
            
            UserResponseDto user = userService.registerVendor(requestDto);
            return ResponseEntity.ok(Map.of(
                "message", "Vendor user registered successfully. Please complete your profile.",
                "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Registration failed",
                "message", e.getMessage()
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
            
            // Add vendor profile status to response if user is a vendor
            if (user.getRoleName().equals("VENDOR")) {
                Map<String, Object> responseData;
                VendorProfileResponseDto vendorProfile = vendorProfileService.getVendorProfileByUserId(user.getUserId());
                
                if (vendorProfile != null) {
                    responseData = Map.of(
                        "message", "Login successful",
                        "user", user,
                        "profileComplete", true,
                        "vendorStatus", vendorProfile.getStatus()
                    );
                } else {
                    // Create a proper response when profile doesn't exist
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("message", "Login successful");
                    responseMap.put("user", user);
                    responseMap.put("profileComplete", false);
                    
                    return ResponseEntity.ok(responseMap);
                }
                
                return ResponseEntity.ok(responseData);
            }
            
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
            @PathVariable Integer userId,
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
            @PathVariable Integer userId,
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
            
            // Register user first as USER, then we'll need to update role to ADMIN
            UserResponseDto createdAdmin = userService.registerCustomer(adminRequest);
            
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
    public ResponseEntity<?> makeUserAdmin(@PathVariable Integer userId) {
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
     * Get current authenticated user info
     * @return current user information
     */
    @GetMapping("/debug/current-user")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Not authenticated",
                    "message", "No authentication found in security context"
                ));
            }
            
            String username = authentication.getName();
            String authorities = authentication.getAuthorities().toString();
            
            return ResponseEntity.ok(Map.of(
                "message", "User is authenticated",
                "username", username,
                "authorities", authorities,
                "authenticated", authentication.isAuthenticated(),
                "principal", authentication.getPrincipal()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error checking authentication",
                "message", e.getMessage()
            ));
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;
        
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class PasswordResetRequest {
        private String newPassword;
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
} 