package org.sortoutinnovation.greenmagic.mapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sortoutinnovation.greenmagic.dto.VendorProfileCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileResponseDto;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.VendorProfile;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;

/**
 * Mapper utility for VendorProfile entity and DTOs
 */
public class VendorProfileMapper {
    private static final Logger logger = LoggerFactory.getLogger(VendorProfileMapper.class);

    /**
     * Convert VendorProfile entity to ResponseDto
     * @param vendorProfile the vendor profile entity
     * @return VendorProfileResponseDto
     */
    public static VendorProfileResponseDto toResponseDto(VendorProfile vendorProfile) {
        if (vendorProfile == null) {
            return null;
        }

        VendorProfileResponseDto dto = new VendorProfileResponseDto();
        dto.setVendorId(vendorProfile.getVendorId());
        dto.setBusinessName(vendorProfile.getBusinessName());
        dto.setLegalBusinessName(vendorProfile.getLegalBusinessName());
        dto.setGstNumber(vendorProfile.getGstNumber());
        dto.setPanNumber(vendorProfile.getPanNumber());
        dto.setBusinessType(vendorProfile.getBusinessType());
        dto.setBusinessPhone(vendorProfile.getBusinessPhone());
        dto.setBusinessEmail(vendorProfile.getBusinessEmail());
        dto.setSupportEmail(vendorProfile.getSupportEmail());
        dto.setWebsiteUrl(vendorProfile.getWebsiteUrl());
        
        // Address fields
        dto.setAddress(vendorProfile.getAddress());
        dto.setAddressLine1(vendorProfile.getAddressLine1());
        dto.setAddressLine2(vendorProfile.getAddressLine2());
        dto.setCity(vendorProfile.getCity());
        dto.setState(vendorProfile.getState());
        dto.setPincode(vendorProfile.getPincode());
        dto.setCountry(vendorProfile.getCountry());
        
        // Bank details
        dto.setAccountHolderName(vendorProfile.getAccountHolderName());
        dto.setAccountNumber(vendorProfile.getAccountNumber());
        dto.setIfscCode(vendorProfile.getIfscCode());
        dto.setBankName(vendorProfile.getBankName());
        dto.setBankBranch(vendorProfile.getBankBranch());
        
        // Store details
        dto.setStoreDescription(vendorProfile.getStoreDescription());
        dto.setStoreDisplayName(vendorProfile.getStoreDisplayName());
        dto.setProductCategories(vendorProfile.getProductCategories());
        
        // Document URLs
        dto.setLogoUrl(vendorProfile.getLogoUrl());
        dto.setGstCertificateUrl(vendorProfile.getGstCertificateUrl());
        dto.setCancelledChequeUrl(vendorProfile.getCancelledChequeUrl());
        dto.setPanCardUrl(vendorProfile.getPanCardUrl());
        dto.setIdentityProofUrl(vendorProfile.getIdentityProofUrl());
        
        // Status fields
        dto.setStatus(vendorProfile.getStatus());
        dto.setRejectionReason(vendorProfile.getRejectionReason());
        dto.setCreatedAt(vendorProfile.getCreatedAt());
        dto.setApprovedAt(vendorProfile.getApprovedAt());
        dto.setRejectedAt(vendorProfile.getRejectedAt());
        
        // Set user information if available
        if (vendorProfile.getUser() != null) {
            User user = vendorProfile.getUser();
            dto.setUserId(user.getUserId());
            dto.setUserName(user.getName());
            dto.setUserEmail(user.getEmail());
        }
        
        return dto;
    }

    /**
     * Convert request DTO to VendorProfile entity
     * @param dto the request dto
     * @param user the associated user entity
     * @return VendorProfile entity
     */
    public static VendorProfile toEntity(VendorProfileCreateRequestDto dto, User user) {
        if (dto == null) {
            return null;
        }

        VendorProfile vendorProfile = new VendorProfile();
        vendorProfile.setUser(user);
        
        // Set required fields with dto values or defaults
        vendorProfile.setBusinessName(dto.getBusinessName());
        vendorProfile.setLegalBusinessName(dto.getLegalBusinessName());
        
        // For GST number, check if it's a placeholder and handle accordingly
        if (dto.getGstNumber() != null && dto.getGstNumber().equals("22AAAAA0000A1Z5")) {
            // This is a placeholder for initial vendor profile creation
            // Create a shorter temporary GST number that fits within the 20 character limit
            String tempGst = "TEMP" + user.getUserId();
            logger.info("Generated temporary GST number: {}", tempGst);
            vendorProfile.setGstNumber(tempGst); 
        } else {
            vendorProfile.setGstNumber(dto.getGstNumber());
            logger.info("Using provided GST number: {}", dto.getGstNumber());
        }
        
        vendorProfile.setPanNumber(dto.getPanNumber());
        
        // Set business type if provided
        if (dto.getBusinessType() != null) {
            vendorProfile.setBusinessType(dto.getBusinessType());
            logger.info("Setting business type: {}", dto.getBusinessType());
        }
        
        vendorProfile.setBusinessPhone(dto.getBusinessPhone());
        vendorProfile.setBusinessEmail(dto.getBusinessEmail());
        vendorProfile.setSupportEmail(dto.getSupportEmail());
        vendorProfile.setWebsiteUrl(dto.getWebsiteUrl());
        
        // Handle address - set address field for backward compatibility
        // New code should use the structured address fields instead
        if (dto.getAddressLine1() != null) {
            vendorProfile.setAddressLine1(dto.getAddressLine1());
            vendorProfile.setAddressLine2(dto.getAddressLine2());
            vendorProfile.setCity(dto.getCity());
            vendorProfile.setState(dto.getState());
            vendorProfile.setPincode(dto.getPincode());
            vendorProfile.setCountry(dto.getCountry());
            
            // Set the database 'address' column with a formatted address
            vendorProfile.setAddress(dto.getAddressLine1());
            logger.info("Setting address field from addressLine1: {}", dto.getAddressLine1());
        } else if (dto.getAddress() != null) {
            vendorProfile.setAddressLine1(dto.getAddress());
            
            // Set default values for required address fields if not provided
            vendorProfile.setCity(dto.getCity() != null ? dto.getCity() : "To be provided");
            vendorProfile.setState(dto.getState() != null ? dto.getState() : "To be provided");
            vendorProfile.setPincode(dto.getPincode() != null ? dto.getPincode() : "000000");
            vendorProfile.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
            
            // Set the database 'address' column with a default value
            vendorProfile.setAddress(dto.getAddress());
            logger.info("Setting address field from address: {}", dto.getAddress());
        } else {
            // Set a default value for address to avoid NOT NULL constraint violation
            String defaultAddress = "Address to be provided later";
            vendorProfile.setAddress(defaultAddress);
            vendorProfile.setAddressLine1(defaultAddress);
            vendorProfile.setCity("To be provided");
            vendorProfile.setState("To be provided");
            vendorProfile.setPincode("000000");
            vendorProfile.setCountry("India");
            logger.info("Setting default address field: {}", defaultAddress);
        }
        
        // Bank details
        vendorProfile.setAccountHolderName(dto.getAccountHolderName());
        vendorProfile.setAccountNumber(dto.getAccountNumber());
        vendorProfile.setIfscCode(dto.getIfscCode());
        vendorProfile.setBankName(dto.getBankName());
        vendorProfile.setBankBranch(dto.getBankBranch());
        
        // Store details
        vendorProfile.setStoreDescription(dto.getStoreDescription());
        vendorProfile.setStoreDisplayName(dto.getStoreDisplayName());
        vendorProfile.setProductCategories(dto.getProductCategories());
        
        // Document URLs
        vendorProfile.setLogoUrl(dto.getLogoUrl());
        vendorProfile.setGstCertificateUrl(dto.getGstCertificateUrl());
        vendorProfile.setCancelledChequeUrl(dto.getCancelledChequeUrl());
        vendorProfile.setPanCardUrl(dto.getPanCardUrl());
        vendorProfile.setIdentityProofUrl(dto.getIdentityProofUrl());
        
        vendorProfile.setStatus(VendorStatus.PENDING); // Default status for new vendors
        
        return vendorProfile;
    }

    /**
     * Update existing VendorProfile entity with dto values
     * @param vendorProfile existing vendor profile entity
     * @param dto update request dto
     * @return updated VendorProfile entity
     */
    public static VendorProfile updateEntity(VendorProfile vendorProfile, VendorProfileCreateRequestDto dto) {
        if (vendorProfile == null || dto == null) {
            return vendorProfile;
        }

        // Basic business info
        vendorProfile.setBusinessName(dto.getBusinessName());
        vendorProfile.setLegalBusinessName(dto.getLegalBusinessName());
        
        // Only update GST if it has changed and is valid
        if (!vendorProfile.getGstNumber().equals(dto.getGstNumber())) {
            vendorProfile.setGstNumber(dto.getGstNumber());
        }
        
        // Only update PAN if it has changed
        if (dto.getPanNumber() != null && 
            !dto.getPanNumber().equals(vendorProfile.getPanNumber())) {
            vendorProfile.setPanNumber(dto.getPanNumber());
        }
        
        // Update business type if provided
        if (dto.getBusinessType() != null) {
            vendorProfile.setBusinessType(dto.getBusinessType());
        }
        
        // Contact details
        vendorProfile.setBusinessPhone(dto.getBusinessPhone());
        vendorProfile.setBusinessEmail(dto.getBusinessEmail());
        vendorProfile.setSupportEmail(dto.getSupportEmail());
        vendorProfile.setWebsiteUrl(dto.getWebsiteUrl());
        
        // Address fields
        if (dto.getAddressLine1() != null && !dto.getAddressLine1().isEmpty()) {
            vendorProfile.setAddressLine1(dto.getAddressLine1());
            vendorProfile.setAddressLine2(dto.getAddressLine2());
            vendorProfile.setCity(dto.getCity());
            vendorProfile.setState(dto.getState());
            vendorProfile.setPincode(dto.getPincode());
            vendorProfile.setCountry(dto.getCountry());
            
            // Update the legacy address field
            vendorProfile.setAddress(dto.getAddressLine1());
        } else if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
            vendorProfile.setAddressLine1(dto.getAddress());
            vendorProfile.setAddress(dto.getAddress());
            
            // Update city, state, pincode, country if provided
            if (dto.getCity() != null) vendorProfile.setCity(dto.getCity());
            if (dto.getState() != null) vendorProfile.setState(dto.getState());
            if (dto.getPincode() != null) vendorProfile.setPincode(dto.getPincode());
            if (dto.getCountry() != null) vendorProfile.setCountry(dto.getCountry());
        }
        
        // Bank details
        vendorProfile.setAccountHolderName(dto.getAccountHolderName());
        vendorProfile.setAccountNumber(dto.getAccountNumber());
        vendorProfile.setIfscCode(dto.getIfscCode());
        vendorProfile.setBankName(dto.getBankName());
        vendorProfile.setBankBranch(dto.getBankBranch());
        
        // Store details
        vendorProfile.setStoreDescription(dto.getStoreDescription());
        vendorProfile.setStoreDisplayName(dto.getStoreDisplayName());
        vendorProfile.setProductCategories(dto.getProductCategories());
        
        // Document URLs - only update if provided
        if (dto.getLogoUrl() != null && !dto.getLogoUrl().isBlank()) {
            vendorProfile.setLogoUrl(dto.getLogoUrl());
        }
        
        if (dto.getGstCertificateUrl() != null && !dto.getGstCertificateUrl().isBlank()) {
            vendorProfile.setGstCertificateUrl(dto.getGstCertificateUrl());
        }
        
        if (dto.getCancelledChequeUrl() != null && !dto.getCancelledChequeUrl().isBlank()) {
            vendorProfile.setCancelledChequeUrl(dto.getCancelledChequeUrl());
        }
        
        if (dto.getPanCardUrl() != null && !dto.getPanCardUrl().isBlank()) {
            vendorProfile.setPanCardUrl(dto.getPanCardUrl());
        }
        
        if (dto.getIdentityProofUrl() != null && !dto.getIdentityProofUrl().isBlank()) {
            vendorProfile.setIdentityProofUrl(dto.getIdentityProofUrl());
        }
        
        return vendorProfile;
    }
} 