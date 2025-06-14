package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.Address;

/**
 * DTO for address creation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressCreateRequestDto {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @NotBlank(message = "ZIP code is required")
    @Size(max = 20, message = "ZIP code must not exceed 20 characters")
    @Pattern(regexp = "^[0-9]{5,6}$", message = "Please provide a valid ZIP code")
    private String zipCode;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[1-9]\\d{1,14}$", message = "Please provide a valid phone number")
    private String phoneNumber;

    private Address.AddressType addressType = Address.AddressType.HOME;

    private Boolean isDefault = false;
} 