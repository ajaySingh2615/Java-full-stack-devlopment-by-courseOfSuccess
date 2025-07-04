package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.dto.UserRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.dto.VendorRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.mapper.UserMapper;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.Role;
import org.sortoutinnovation.greenmagic.model.User.RegistrationStatus;
import org.sortoutinnovation.greenmagic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for User business logic
 * Handles user registration, authentication, and profile management
 * Uses BCrypt for secure password hashing
 */
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleService roleService;

    /**
     * Register a new customer user
     * @param registrationRequest user registration data
     * @return UserResponseDto
     * @throws RuntimeException if email or phone already exists
     */
    public UserResponseDto registerCustomer(UserRegistrationRequestDto registrationRequest) {
        // Validate unique email
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate unique phone number
        if (registrationRequest.getPhoneNumber() != null && 
            userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Get USER role
        Role role = roleService.getRoleByName("USER");

        // Create new user using UserMapper
        User user = new User(
            registrationRequest.getName(),
            registrationRequest.getEmail(),
            hashPassword(registrationRequest.getPassword()),
            role
        );
        
        user.setPhoneNumber(registrationRequest.getPhoneNumber());
        user.setRegistrationStatus(RegistrationStatus.COMPLETE);

        User savedUser = userRepository.save(user);
        return UserMapper.toResponseDto(savedUser);
    }
    
    /**
     * Register a new vendor user (step 1)
     * @param registrationRequest vendor registration data
     * @return UserResponseDto
     * @throws RuntimeException if email or phone already exists
     */
    public UserResponseDto registerVendor(VendorRegistrationRequestDto registrationRequest) {
        // Validate unique email
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate unique phone number
        if (registrationRequest.getPhoneNumber() != null && 
            userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Get VENDOR role
        Role role = roleService.getRoleByName("VENDOR");

        // Create new user using UserMapper
        User user = new User(
            registrationRequest.getName(),
            registrationRequest.getEmail(),
            hashPassword(registrationRequest.getPassword()),
            role,
            RegistrationStatus.INCOMPLETE
        );
        
        user.setPhoneNumber(registrationRequest.getPhoneNumber());

        // Log businessType value coming from request
        System.out.println("BusinessType from request: " + registrationRequest.getBusinessType());
        System.out.println("Terms accepted: " + registrationRequest.getTermsAccepted());

        User savedUser = userRepository.save(user);
        return UserMapper.toResponseDto(savedUser);
    }

    /**
     * Register a new user (deprecated)
     * @param registrationRequest user registration data
     * @return UserResponseDto
     * @throws RuntimeException if email or phone already exists
     * @deprecated Use registerCustomer or registerVendor instead
     */
    @Deprecated
    public UserResponseDto registerUser(UserRegistrationRequestDto registrationRequest) {
        // Validate unique email
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate unique phone number
        if (userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Default to USER role
        Role role = roleService.getRoleByName("USER");

        // Create new user using UserMapper
        User user = UserMapper.toEntity(registrationRequest, role);
        
        // Hash password using BCrypt
        user.setPassword(hashPassword(registrationRequest.getPassword()));

        User savedUser = userRepository.save(user);
        return UserMapper.toResponseDto(savedUser);
    }

    /**
     * Get all users with pagination
     * @param pageable pagination information
     * @return Page<UserResponseDto>
     */
    @Transactional(readOnly = true)
    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserMapper::toResponseDto);
    }

    /**
     * Get user by ID
     * @param id user ID
     * @return UserResponseDto
     * @throws RuntimeException if user not found
     */
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Integer id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return UserMapper.toResponseDto(user);
    }

    /**
     * Get user by email
     * @param email user email
     * @return UserResponseDto
     * @throws RuntimeException if user not found
     */
    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return UserMapper.toResponseDto(user);
    }

    /**
     * Get all users
     * @return List<UserResponseDto>
     */
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAllUsers();
        return users.stream()
            .map(UserMapper::toResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * Update user profile
     * @param id user ID
     * @param updateRequest updated user data
     * @return UserResponseDto
     * @throws RuntimeException if user not found or email already exists
     */
    public UserResponseDto updateUser(Integer id, UserRegistrationRequestDto updateRequest) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if email is being changed and if new email already exists
        if (!user.getEmail().equals(updateRequest.getEmail()) && 
            userRepository.existsByEmail(updateRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Update user fields
        user.setName(updateRequest.getName());
        user.setEmail(updateRequest.getEmail());
        user.setPhoneNumber(updateRequest.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return UserMapper.toResponseDto(updatedUser);
    }

    /**
     * Hash password using BCrypt
     * @param password plain text password
     * @return hashed password
     */
    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    /**
     * Verify password using BCrypt
     * @param plainPassword plain text password
     * @param hashedPassword hashed password from database
     * @return boolean indicating if passwords match
     */
    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    /**
     * Update user password
     * @param id user ID
     * @param currentPassword current password for verification
     * @param newPassword new password to set
     * @return UserResponseDto
     * @throws RuntimeException if user not found or current password is incorrect
     */
    public UserResponseDto updatePassword(Integer id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Verify current password
        if (!verifyPassword(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password with new hash
        user.setPassword(hashPassword(newPassword));
        User updatedUser = userRepository.save(user);
        
        return UserMapper.toResponseDto(updatedUser);
    }

    /**
     * Delete user
     * @param id user ID
     * @throws RuntimeException if user not found
     */
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Authenticate user by email and password
     * @param email user email
     * @param password user password
     * @return UserResponseDto
     * @throws RuntimeException if authentication fails
     */
    @Transactional(readOnly = true)
    public UserResponseDto authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password using BCrypt
        if (!verifyPassword(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return UserMapper.toResponseDto(user);
    }

    /**
     * Check if user exists by email
     * @param email user email
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Check if user exists by phone number
     * @param phoneNumber user phone number
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    /**
     * Get users by role name
     * @param roleName role name
     * @return List<UserResponseDto>
     */
    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsersByRole(String roleName) {
        List<User> users = userRepository.findByRoleName(roleName);
        return users.stream()
            .map(UserMapper::toResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * Get users created today
     * @return List<UserResponseDto>
     */
    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsersCreatedToday() {
        List<User> users = userRepository.findUsersCreatedToday();
        return users.stream()
            .map(UserMapper::toResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * Reset user password (admin function)
     * @param userId user ID
     * @param newPassword new password
     * @return UserResponseDto
     * @throws RuntimeException if user not found
     */
    public UserResponseDto resetPassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Hash and set new password
        user.setPassword(hashPassword(newPassword));
        User updatedUser = userRepository.save(user);
        
        return UserMapper.toResponseDto(updatedUser);
    }

    /**
     * Update user role (for admin creation purposes)
     * @param userId user ID
     * @param roleName new role name
     * @return UserResponseDto
     * @throws RuntimeException if user or role not found
     */
    public UserResponseDto updateUserRole(Integer userId, String roleName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Role role = roleService.getRoleByName(roleName);
        user.setRole(role);
        
        User updatedUser = userRepository.save(user);
        return UserMapper.toResponseDto(updatedUser);
    }

    /**
     * Update user registration status
     * @param userId user ID
     * @param status registration status
     * @return UserResponseDto
     * @throws RuntimeException if user not found
     */
    public UserResponseDto updateRegistrationStatus(Integer userId, RegistrationStatus status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setRegistrationStatus(status);
        User updatedUser = userRepository.save(user);
        
        return UserMapper.toResponseDto(updatedUser);
    }
} 