package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.UserRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.model.Role;
import org.sortoutinnovation.greenmagic.service.UserService;
import org.sortoutinnovation.greenmagic.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST Controller for User management operations
 * Provides endpoints for user registration, authentication, and profile management
 */
@RestController
@RequestMapping("/users")
@Validated
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    /**
     * Register a new user
     * POST /users/register (accessible at /api/users/register due to context path)
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> registerUser(
            @Valid @RequestBody UserRegistrationRequestDto registrationRequest) {
        
        try {
            UserResponseDto responseDto = userService.registerUser(registrationRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "User registered successfully", responseDto));
                
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Registration failed: " + e.getMessage(), null));
        }
    }

    /**
     * Get all users with pagination
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<ApiResponseDto<Page<UserResponseDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserResponseDto> userDtos = userService.getAllUsers(pageable);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Users retrieved successfully", userDtos));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve users: " + e.getMessage(), null));
        }
    }

    /**
     * Get user by ID
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> getUserById(@PathVariable Integer id) {
        try {
            UserResponseDto responseDto = userService.getUserById(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User found", responseDto));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user: " + e.getMessage(), null));
        }
    }

    /**
     * Get user by email
     * GET /api/users/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> getUserByEmail(@PathVariable String email) {
        try {
            UserResponseDto responseDto = userService.getUserByEmail(email);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User found", responseDto));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve user: " + e.getMessage(), null));
        }
    }

    /**
     * Get active users
     * GET /api/users/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponseDto<List<UserResponseDto>>> getActiveUsers() {
        try {
            List<UserResponseDto> userDtos = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Users retrieved successfully", userDtos));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve users: " + e.getMessage(), null));
        }
    }

    /**
     * Update user profile
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<UserResponseDto>> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserRegistrationRequestDto updateRequest) {
        
        try {
            UserResponseDto responseDto = userService.updateUser(id, updateRequest);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User updated successfully", responseDto));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update user: " + e.getMessage(), null));
        }
    }

    /**
     * Delete user
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "User deleted successfully", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete user: " + e.getMessage(), null));
        }
    }

    /**
     * Get available roles for registration
     * GET /api/users/roles
     */
    @GetMapping("/roles")
    public ResponseEntity<ApiResponseDto<List<Role>>> getAvailableRoles() {
        try {
            List<Role> roles = roleService.getAllRoles();
            // Filter out ADMIN role from public registration
            List<Role> publicRoles = roles.stream()
                .filter(role -> !role.getRoleName().equals("ADMIN"))
                .toList();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Roles retrieved successfully", publicRoles));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve roles: " + e.getMessage(), null));
        }
    }
} 