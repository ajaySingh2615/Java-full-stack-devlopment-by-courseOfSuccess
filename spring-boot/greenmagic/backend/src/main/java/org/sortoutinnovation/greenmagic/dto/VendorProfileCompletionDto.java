package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for vendor profile completion (step 2)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileCompletionDto {

    // Business Details
    @NotBlank(message = "Business name is required")
    @Size(max = 100, message = "Business name must not exceed 100 characters")
    private String businessName;
    
    @Size(max = 100, message = "Legal business name must not exceed 100 characters")
    private String legalBusinessName;

    @NotBlank(message = "GST number is required")
    @Size(max = 20, message = "GST number must not exceed 20 characters")
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
             message = "Please provide a valid GST number format")
    private String gstNumber;
    
    @Size(max = 20, message = "PAN number must not exceed 20 characters")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message = "Please provide a valid PAN number format")
    private String panNumber;

    // Business Contact Info
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
    
    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String websiteUrl;

    // Business Address
    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;
    
    private String addressLine2;
    
    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    @Size(max = 10, message = "Pincode must not exceed 10 characters")
    @Pattern(regexp = "^[0-9]{6}$", message = "Please provide a valid 6-digit pincode")
    private String pincode;
    
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country;
    
    // Bank Details
    @Size(max = 100, message = "Account holder name must not exceed 100 characters")
    private String accountHolderName;
    
    @Size(max = 30, message = "Account number must not exceed 30 characters")
    private String accountNumber;
    
    @Size(max = 20, message = "IFSC code must not exceed 20 characters")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Please provide a valid IFSC code")
    private String ifscCode;
    
    @Size(max = 50, message = "Bank name must not exceed 50 characters")
    private String bankName;
    
    @Size(max = 50, message = "Bank branch must not exceed 50 characters")
    private String bankBranch;

    // Store Profile Info
    @Size(max = 100, message = "Store display name must not exceed 100 characters")
    private String storeDisplayName;
    
    private String storeDescription;
    
    private String productCategories;
    
    // Document URLs (to be populated by separate file upload API)
    private String logoUrl;
    
    private String gstCertificateUrl;
    
    private String cancelledChequeUrl;
    
    private String panCardUrl;
    
    private String identityProofUrl;
} 