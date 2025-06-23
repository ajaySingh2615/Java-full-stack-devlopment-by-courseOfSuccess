package org.sortoutinnovation.greenmagic.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.VendorProfile.BusinessType;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;

/**
 * DTO for vendor profile responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfileResponseDto {

    private Integer vendorId;
    private Integer userId;
    private String userName;
    private String userEmail;
    private String businessName;
    private String legalBusinessName;
    private String gstNumber;
    private String panNumber;
    private BusinessType businessType;
    private String businessPhone;
    private String businessEmail;
    private String supportEmail;
    private String websiteUrl;
    
    // Combined address field (legacy)
    private String address;
    
    // Structured address fields
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    
    // Bank details
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private String bankBranch;
    
    // Store details
    private String storeDescription;
    private String storeDisplayName;
    private String productCategories;
    
    // Document URLs
    private String logoUrl;
    private String gstCertificateUrl;
    private String cancelledChequeUrl;
    private String panCardUrl;
    private String identityProofUrl;
    
    // Status fields
    private VendorStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
} 