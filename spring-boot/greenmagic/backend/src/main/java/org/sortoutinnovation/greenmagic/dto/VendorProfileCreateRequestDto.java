package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.VendorProfile.BusinessType;

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
    // We're handling the GST format validation in the mapper
    private String gstNumber;

    @NotBlank(message = "Business phone is required")
    @Size(max = 15, message = "Business phone must not exceed 15 characters")
    @Pattern(regexp = "^[+]?[1-9]\\d{1,14}$", message = "Please provide a valid business phone number")
    private String businessPhone;

    @NotBlank(message = "Business email is required")
    @Email(message = "Please provide a valid business email address")
    @Size(max = 100, message = "Business email must not exceed 100 characters")
    private String businessEmail;

    // Backward compatibility field
    @NotBlank(message = "Address is required")
    private String address;
    
    // Additional address fields for more structured address data
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    
    // Business type
    private BusinessType businessType;

    private String storeDescription;

    @Size(max = 255, message = "Logo URL must not exceed 255 characters")
    private String logoUrl;
    
    /**
     * Check if this is a temporary GST number during initial profile creation
     * @return true if GST number is temporary
     */
    public boolean isTemporaryGst() {
        return gstNumber != null && (
            gstNumber.equals("22AAAAA0000A1Z5") || 
            gstNumber.equals("PENDING") ||
            gstNumber.startsWith("TEMP-") ||
            gstNumber.startsWith("TEMP")
        );
    }
} 