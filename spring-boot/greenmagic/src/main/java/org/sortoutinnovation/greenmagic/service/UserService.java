package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.dto.UserRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.mapper.UserMapper;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for User business logic
 * Handles user registration, authentication, and profile management
 */
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user
     * @param registrationRequest user registration data
     * @return UserResponseDto
     * @throws RuntimeException if email or phone already exists
     */
    public UserResponseDto registerUser(UserRegistrationRequestDto registrationRequest) {
        // Validate unique email
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate unique phone number
        if (userRepository.existsByPhoneNumber(registrationRequest.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Create new user
        User user = new User();
        user.setName(registrationRequest.getName());
        user.setEmail(registrationRequest.getEmail());
        user.setPhoneNumber(registrationRequest.getPhoneNumber());
        user.setPassword(hashPassword(registrationRequest.getPassword())); // Hash password

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
    public UserResponseDto getUserById(Long id) {
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
    public UserResponseDto updateUser(Long id, UserRegistrationRequestDto updateRequest) {
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
     * Delete user
     * @param id user ID
     * @throws RuntimeException if user not found
     */
    public void deleteUser(Long id) {
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
     * Hash password (placeholder implementation)
     * In production, use BCrypt or similar
     * @param password plain text password
     * @return hashed password
     */
    private String hashPassword(String password) {
        // TODO: Implement proper password hashing with BCrypt
        return password; // Placeholder - DO NOT use in production
    }

    /**
     * Verify password (placeholder implementation)
     * In production, use BCrypt or similar
     * @param plainPassword plain text password
     * @param hashedPassword hashed password
     * @return boolean
     */
    private boolean verifyPassword(String plainPassword, String hashedPassword) {
        // TODO: Implement proper password verification with BCrypt
        return plainPassword.equals(hashedPassword); // Placeholder - DO NOT use in production
    }
} 