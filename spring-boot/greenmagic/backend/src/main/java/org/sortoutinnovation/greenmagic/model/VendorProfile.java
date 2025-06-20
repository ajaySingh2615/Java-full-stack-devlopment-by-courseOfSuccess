package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing vendor profiles in the system
 * Maps to the 'vendor_profiles' table in the database
 */
@Entity
@Table(name = "vendor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Integer vendorId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @NotBlank(message = "Business name is required")
    @Size(max = 100, message = "Business name must not exceed 100 characters")
    @Column(name = "business_name", nullable = false, length = 100)
    private String businessName;
    
    @Size(max = 100, message = "Legal business name must not exceed 100 characters")
    @Column(name = "legal_business_name", length = 100)
    private String legalBusinessName;

    @NotBlank(message = "GST number is required")
    @Size(max = 20, message = "GST number must not exceed 20 characters")
    @Column(name = "gst_number", unique = true, nullable = false, length = 20)
    private String gstNumber;
    
    @Size(max = 20, message = "PAN number must not exceed 20 characters")
    @Column(name = "pan_number", length = 20)
    private String panNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", length = 30)
    private BusinessType businessType;

    @NotBlank(message = "Business phone is required")
    @Size(max = 15, message = "Business phone must not exceed 15 characters")
    @Column(name = "business_phone", length = 15)
    private String businessPhone;

    @NotBlank(message = "Business email is required")
    @Email(message = "Please provide a valid business email address")
    @Size(max = 100, message = "Business email must not exceed 100 characters")
    @Column(name = "business_email", length = 100)
    private String businessEmail;
    
    @Email(message = "Please provide a valid support email address")
    @Size(max = 100, message = "Support email must not exceed 100 characters")
    @Column(name = "support_email", length = 100)
    private String supportEmail;
    
    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @NotBlank(message = "Address is required")
    @Column(name = "address_line1", columnDefinition = "TEXT")
    private String addressLine1;
    
    @Column(name = "address_line2", columnDefinition = "TEXT")
    private String addressLine2;
    
    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must not exceed 50 characters")
    @Column(name = "city", length = 50)
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must not exceed 50 characters")
    @Column(name = "state", length = 50)
    private String state;
    
    @NotBlank(message = "Pincode is required")
    @Size(max = 10, message = "Pincode must not exceed 10 characters")
    @Column(name = "pincode", length = 10)
    private String pincode;
    
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country must not exceed 50 characters")
    @Column(name = "country", length = 50)
    private String country;
    
    /**
     * Combined address field for backward compatibility with mapper
     * This is a transient field that gets populated from address components
     */
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address = "Address to be provided later";
    
    /**
     * Get a formatted address string from the components
     * @return full address as a string
     */
    public String getAddress() {
        StringBuilder sb = new StringBuilder();
        if (addressLine1 != null) sb.append(addressLine1);
        
        if (addressLine2 != null && !addressLine2.isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(addressLine2);
        }
        
        if (city != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(city);
        }
        
        if (state != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(state);
        }
        
        if (pincode != null) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(pincode);
        }
        
        if (country != null && !country.equalsIgnoreCase("India")) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(country);
        }
        
        return sb.toString();
    }
    
    /**
     * Set address components from a single address string
     * This method tries to parse a single address string into components
     * @param address full address as string
     */
    public void setAddress(String address) {
        // For new vendors, we'll use structured address fields instead
        // This method is kept for backward compatibility with existing code
        if (this.addressLine1 == null) {
            this.addressLine1 = address;
        }
    }
    
    // Bank details
    @Size(max = 100, message = "Account holder name must not exceed 100 characters")
    @Column(name = "account_holder_name", length = 100)
    private String accountHolderName;
    
    @Size(max = 30, message = "Account number must not exceed 30 characters")
    @Column(name = "account_number", length = 30)
    private String accountNumber;
    
    @Size(max = 20, message = "IFSC code must not exceed 20 characters")
    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;
    
    @Size(max = 50, message = "Bank name must not exceed 50 characters")
    @Column(name = "bank_name", length = 50)
    private String bankName;
    
    @Size(max = 50, message = "Bank branch must not exceed 50 characters")
    @Column(name = "bank_branch", length = 50)
    private String bankBranch;

    @Column(name = "store_description", columnDefinition = "TEXT")
    private String storeDescription;
    
    @Size(max = 100, message = "Store display name must not exceed 100 characters")
    @Column(name = "store_display_name", length = 100)
    private String storeDisplayName;
    
    @Column(name = "product_categories")
    private String productCategories;

    @Size(max = 255, message = "Logo URL must not exceed 255 characters")
    @Column(name = "logo_url", length = 255)
    private String logoUrl;
    
    @Size(max = 255, message = "GST certificate URL must not exceed 255 characters")
    @Column(name = "gst_certificate_url", length = 255)
    private String gstCertificateUrl;
    
    @Size(max = 255, message = "Cancelled cheque URL must not exceed 255 characters")
    @Column(name = "cancelled_cheque_url", length = 255)
    private String cancelledChequeUrl;
    
    @Size(max = 255, message = "PAN card URL must not exceed 255 characters")
    @Column(name = "pan_card_url", length = 255)
    private String panCardUrl;
    
    @Size(max = 255, message = "Identity proof URL must not exceed 255 characters")
    @Column(name = "identity_proof_url", length = 255)
    private String identityProofUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VendorStatus status = VendorStatus.PENDING;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    public enum VendorStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
    
    public enum BusinessType {
        PROPRIETORSHIP,
        PARTNERSHIP,
        PRIVATE_LIMITED,
        LIMITED_COMPANY,
        LLP,
        INDIVIDUAL,
        DISTRIBUTOR,
        MANUFACTURER,
        OTHER
    }
} 