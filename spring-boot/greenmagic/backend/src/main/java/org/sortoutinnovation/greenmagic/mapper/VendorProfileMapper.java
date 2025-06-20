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
        dto.setGstNumber(vendorProfile.getGstNumber());
        dto.setBusinessPhone(vendorProfile.getBusinessPhone());
        dto.setBusinessEmail(vendorProfile.getBusinessEmail());
        dto.setAddress(vendorProfile.getAddress());
        dto.setStoreDescription(vendorProfile.getStoreDescription());
        dto.setLogoUrl(vendorProfile.getLogoUrl());
        dto.setStatus(vendorProfile.getStatus());
        dto.setCreatedAt(vendorProfile.getCreatedAt());
        
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
        
        // Set business type if provided
        if (dto.getBusinessType() != null) {
            vendorProfile.setBusinessType(dto.getBusinessType());
            logger.info("Setting business type: {}", dto.getBusinessType());
        }
        
        vendorProfile.setBusinessPhone(dto.getBusinessPhone());
        vendorProfile.setBusinessEmail(dto.getBusinessEmail());
        
        // Handle address - set address field for backward compatibility
        // New code should use the structured address fields instead
        if (dto.getAddress() != null) {
            vendorProfile.setAddressLine1(dto.getAddressLine1() != null ? 
                dto.getAddressLine1() : dto.getAddress());
            
            // Set default values for required address fields if not provided
            vendorProfile.setCity(dto.getCity() != null ? dto.getCity() : "To be provided");
            vendorProfile.setState(dto.getState() != null ? dto.getState() : "To be provided");
            vendorProfile.setPincode(dto.getPincode() != null ? dto.getPincode() : "000000");
            vendorProfile.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
            
            // Set the database 'address' column with a default value
            vendorProfile.setAddress(dto.getAddressLine1() != null ? 
                dto.getAddressLine1() : dto.getAddress());
            logger.info("Setting address field: {}", vendorProfile.getAddress());
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
        
        vendorProfile.setStoreDescription(dto.getStoreDescription());
        vendorProfile.setLogoUrl(dto.getLogoUrl());
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

        vendorProfile.setBusinessName(dto.getBusinessName());
        // Only update GST if it has changed and is valid
        if (!vendorProfile.getGstNumber().equals(dto.getGstNumber())) {
            vendorProfile.setGstNumber(dto.getGstNumber());
        }
        vendorProfile.setBusinessPhone(dto.getBusinessPhone());
        vendorProfile.setBusinessEmail(dto.getBusinessEmail());
        
        // Handle address 
        if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
            vendorProfile.setAddressLine1(dto.getAddress());
            vendorProfile.setAddress(dto.getAddress());
        }
        
        vendorProfile.setStoreDescription(dto.getStoreDescription());
        
        // Only update logo URL if provided
        if (dto.getLogoUrl() != null && !dto.getLogoUrl().isBlank()) {
            vendorProfile.setLogoUrl(dto.getLogoUrl());
        }
        
        return vendorProfile;
    }
} 