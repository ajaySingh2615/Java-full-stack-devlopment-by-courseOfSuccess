package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for address response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponseDto {

    private Integer addressId;
    private String name;
    private String addressLine;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phoneNumber;
    private Boolean isDefault;
    private String addressType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructor for basic address info
    public AddressResponseDto(Integer addressId, String name, String addressLine, String city, String state, String zipCode) {
        this.addressId = addressId;
        this.name = name;
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = "India"; // Default country
        this.isDefault = false;
    }
} 