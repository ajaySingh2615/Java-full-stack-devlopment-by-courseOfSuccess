package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for vendor profile creation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileCreateRequestDto {

    @NotBlank(message = "Business name is required")
    @Size(max = 100, message = "Business name must not exceed 100 characters")
    private String businessName;

    @NotBlank(message = "GST number is required")
    @Size(max = 20, message = "GST number must not exceed 20 characters")
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
             message = "Please provide a valid GST number format")
    private String gstNumber;

    @NotBlank(message = "Business phone is required")
    @Size(max = 15, message = "Business phone must not exceed 15 characters")
    @Pattern(regexp = "^[+]?[1-9]\\d{1,14}$", message = "Please provide a valid business phone number")
    private String businessPhone;

    @NotBlank(message = "Business email is required")
    @Email(message = "Please provide a valid business email address")
    @Size(max = 100, message = "Business email must not exceed 100 characters")
    private String businessEmail;

    @NotBlank(message = "Address is required")
    private String address;

    private String storeDescription;

    @Size(max = 255, message = "Logo URL must not exceed 255 characters")
    private String logoUrl;
} 