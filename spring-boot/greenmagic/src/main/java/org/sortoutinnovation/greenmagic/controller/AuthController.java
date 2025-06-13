package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

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

    /**
     * User login endpoint
     * @param loginRequest containing email and password
     * @return UserResponseDto if authentication successful
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            UserResponseDto user = userService.authenticateUser(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            );
            
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