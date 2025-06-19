package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.VendorProfileCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileResponseDto;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.VendorProfile;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;

/**
 * Mapper utility for VendorProfile entity and DTOs
 */
public class VendorProfileMapper {

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
        vendorProfile.setBusinessName(dto.getBusinessName());
        vendorProfile.setGstNumber(dto.getGstNumber());
        vendorProfile.setBusinessPhone(dto.getBusinessPhone());
        vendorProfile.setBusinessEmail(dto.getBusinessEmail());
        vendorProfile.setAddress(dto.getAddress());
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
        vendorProfile.setAddress(dto.getAddress());
        vendorProfile.setStoreDescription(dto.getStoreDescription());
        
        // Only update logo URL if provided
        if (dto.getLogoUrl() != null && !dto.getLogoUrl().isBlank()) {
            vendorProfile.setLogoUrl(dto.getLogoUrl());
        }
        
        return vendorProfile;
    }
} 