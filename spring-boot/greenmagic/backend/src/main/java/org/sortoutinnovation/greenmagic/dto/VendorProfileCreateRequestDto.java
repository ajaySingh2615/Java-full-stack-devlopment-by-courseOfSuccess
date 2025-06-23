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

    @Size(max = 100, message = "Legal business name must not exceed 100 characters")
    private String legalBusinessName;

    @NotBlank(message = "GST number is required")
    @Size(max = 20, message = "GST number must not exceed 20 characters")
    // We're handling the GST format validation in the mapper
    private String gstNumber;
    
    @NotBlank(message = "PAN number is required")
    @Size(max = 20, message = "PAN number must not exceed 20 characters")
    private String panNumber;

    @NotBlank(message = "Business phone is required")
    @Size(max = 15, message = "Business phone must not exceed 15 characters")
    @Pattern(regexp = "^[+]?[1-9]\\d{1,14}$", message = "Please provide a valid business phone number")
    private String businessPhone;

    @NotBlank(message = "Business email is required")
    @Email(message = "Please provide a valid business email address")
    @Size(max = 100, message = "Business email must not exceed 100 characters")
    private String businessEmail;
    
    @Email(message = "Please provide a valid support email address")
    @Size(max = 100, message = "Support email must not exceed 100 characters")
    private String supportEmail;
    
    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String websiteUrl;

    // Backward compatibility field
    @NotBlank(message = "Address is required")
    private String address;
    
    // Additional address fields for more structured address data
    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;
    
    private String addressLine2;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    private String pincode;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    // Bank details
    @NotBlank(message = "Account holder name is required")
    @Size(max = 100, message = "Account holder name must not exceed 100 characters")
    private String accountHolderName;
    
    @NotBlank(message = "Account number is required")
    @Size(max = 30, message = "Account number must not exceed 30 characters")
    private String accountNumber;
    
    @NotBlank(message = "IFSC code is required")
    @Size(max = 20, message = "IFSC code must not exceed 20 characters")
    private String ifscCode;
    
    @NotBlank(message = "Bank name is required")
    @Size(max = 50, message = "Bank name must not exceed 50 characters")
    private String bankName;
    
    @NotBlank(message = "Bank branch is required")
    @Size(max = 50, message = "Bank branch must not exceed 50 characters")
    private String bankBranch;
    
    // Business type
    private BusinessType businessType;

    private String storeDescription;
    
    private String storeDisplayName;
    
    private String productCategories;

    @NotBlank(message = "Logo URL is required")
    @Size(max = 255, message = "Logo URL must not exceed 255 characters")
    private String logoUrl;
    
    @NotBlank(message = "GST certificate URL is required")
    @Size(max = 255, message = "GST certificate URL must not exceed 255 characters")
    private String gstCertificateUrl;
    
    @NotBlank(message = "Cancelled cheque URL is required")
    @Size(max = 255, message = "Cancelled cheque URL must not exceed 255 characters")
    private String cancelledChequeUrl;
    
    @NotBlank(message = "PAN card URL is required")
    @Size(max = 255, message = "PAN card URL must not exceed 255 characters")
    private String panCardUrl;
    
    @NotBlank(message = "Identity proof URL is required")
    @Size(max = 255, message = "Identity proof URL must not exceed 255 characters")
    private String identityProofUrl;
    
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