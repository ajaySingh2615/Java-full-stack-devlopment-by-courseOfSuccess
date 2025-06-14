package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.UserRegistrationRequestDto;
import org.sortoutinnovation.greenmagic.dto.UserResponseDto;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.Role;

/**
 * Mapper utility for User entity and DTOs
 */
public class UserMapper {

    public static UserResponseDto toResponseDto(User user) {
        if (user == null) {
            return null;
        }

        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setCreatedAt(user.getCreatedAt());
        
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getRoleName());
        }
        
        dto.setIsGoogleUser(user.getGoogleId() != null);
        
        return dto;
    }

    public static User toEntity(UserRegistrationRequestDto dto, Role role) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // This should be encoded before calling this method
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole(role);
        
        return user;
    }

    public static User toGoogleUser(String name, String email, String googleId, String googleEmail, String profilePicture, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setGoogleId(googleId);
        user.setGoogleEmail(googleEmail);
        user.setProfilePicture(profilePicture);
        user.setRole(role);
        
        return user;
    }
} 