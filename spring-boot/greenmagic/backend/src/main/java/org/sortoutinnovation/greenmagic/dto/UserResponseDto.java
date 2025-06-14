package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Integer userId;
    private String name;
    private String email;
    private String phoneNumber;
    private String profilePicture;
    private String roleName;
    private Boolean isGoogleUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructor for basic user info
    public UserResponseDto(Integer userId, String name, String email, String roleName) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.roleName = roleName;
        this.isGoogleUser = false;
    }

    // Constructor for Google user
    public UserResponseDto(Integer userId, String name, String email, String profilePicture, String roleName, Boolean isGoogleUser) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.roleName = roleName;
        this.isGoogleUser = isGoogleUser;
    }
} 