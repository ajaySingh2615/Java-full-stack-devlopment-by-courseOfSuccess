package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.dto.VendorProfileCompletionDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileResponseDto;
import org.sortoutinnovation.greenmagic.mapper.VendorProfileMapper;
import org.sortoutinnovation.greenmagic.model.User;
import org.sortoutinnovation.greenmagic.model.User.RegistrationStatus;
import org.sortoutinnovation.greenmagic.model.VendorProfile;
import org.sortoutinnovation.greenmagic.model.VendorProfile.BusinessType;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;
import org.sortoutinnovation.greenmagic.repository.UserRepository;
import org.sortoutinnovation.greenmagic.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for VendorProfile business logic
 * Handles vendor registration, approval, and profile management
 */
@Service
@Transactional
public class VendorProfileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Autowired
    private VendorProfileRepository vendorProfileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;

    /**
     * Complete vendor profile (step 2 of vendor registration)
     * @param userId the user ID
     * @param profileDto profile completion data
     * @return VendorProfileResponseDto
     * @throws RuntimeException if user not found or profile already exists
     */
    public VendorProfileResponseDto completeVendorProfile(Integer userId, VendorProfileCompletionDto profileDto) {
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if vendor profile already exists for this user
        if (vendorProfileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Vendor profile already exists for this user");
        }

        // Check if GST number is unique
        if (vendorProfileRepository.existsByGstNumber(profileDto.getGstNumber())) {
            throw new RuntimeException("GST number already registered");
        }

        // Create new vendor profile
        VendorProfile vendorProfile = new VendorProfile();
        vendorProfile.setUser(user);
        vendorProfile.setBusinessName(profileDto.getBusinessName());
        vendorProfile.setLegalBusinessName(profileDto.getLegalBusinessName());
        vendorProfile.setGstNumber(profileDto.getGstNumber());
        vendorProfile.setPanNumber(profileDto.getPanNumber());
        vendorProfile.setBusinessPhone(profileDto.getBusinessPhone());
        vendorProfile.setBusinessEmail(profileDto.getBusinessEmail());
        vendorProfile.setSupportEmail(profileDto.getSupportEmail());
        vendorProfile.setWebsiteUrl(profileDto.getWebsiteUrl());
        
        // Address data
        vendorProfile.setAddressLine1(profileDto.getAddressLine1());
        vendorProfile.setAddressLine2(profileDto.getAddressLine2());
        vendorProfile.setCity(profileDto.getCity());
        vendorProfile.setState(profileDto.getState());
        vendorProfile.setPincode(profileDto.getPincode());
        vendorProfile.setCountry(profileDto.getCountry());
        
        // Bank details
        vendorProfile.setAccountHolderName(profileDto.getAccountHolderName());
        vendorProfile.setAccountNumber(profileDto.getAccountNumber());
        vendorProfile.setIfscCode(profileDto.getIfscCode());
        vendorProfile.setBankName(profileDto.getBankName());
        vendorProfile.setBankBranch(profileDto.getBankBranch());
        
        // Store details
        vendorProfile.setStoreDisplayName(profileDto.getStoreDisplayName());
        vendorProfile.setStoreDescription(profileDto.getStoreDescription());
        vendorProfile.setProductCategories(profileDto.getProductCategories());
        
        // Document URLs
        vendorProfile.setLogoUrl(profileDto.getLogoUrl());
        vendorProfile.setGstCertificateUrl(profileDto.getGstCertificateUrl());
        vendorProfile.setCancelledChequeUrl(profileDto.getCancelledChequeUrl());
        vendorProfile.setPanCardUrl(profileDto.getPanCardUrl());
        vendorProfile.setIdentityProofUrl(profileDto.getIdentityProofUrl());
        
        // Set status to PENDING
        vendorProfile.setStatus(VendorStatus.PENDING);
        
        // Save to database
        VendorProfile savedProfile = vendorProfileRepository.save(vendorProfile);
        
        // Update user registration status
        userService.updateRegistrationStatus(userId, RegistrationStatus.COMPLETE);
        
        return VendorProfileMapper.toResponseDto(savedProfile);
    }
    
    /**
     * Upload a document for vendor profile
     * @param userId the user ID
     * @param documentType type of document
     * @param file the document file
     * @return document file URL
     * @throws RuntimeException if file upload fails
     */
    public String uploadVendorDocument(Integer userId, String documentType, MultipartFile file) {
        try {
            // Validate user exists
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Create upload directory if it doesn't exist
            String vendorDir = uploadDir + "/vendors/" + userId;
            Files.createDirectories(Paths.get(vendorDir));
            
            // Validate and normalize file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } else {
                throw new RuntimeException("File must have an extension");
            }
            
            // Generate a unique file name
            String newFileName = documentType + "_" + UUID.randomUUID() + fileExtension;
            Path targetLocation = Paths.get(vendorDir).resolve(newFileName);
            
            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Create public URL
            String fileUrl = "/api/files/vendors/" + userId + "/" + newFileName;
            
            // Update vendor profile if it exists
            VendorProfile vendorProfile = vendorProfileRepository.findByUserId(userId).orElse(null);
            
            if (vendorProfile != null) {
                switch (documentType.toLowerCase()) {
                    case "logo":
                        vendorProfile.setLogoUrl(fileUrl);
                        break;
                    case "gst_certificate":
                        vendorProfile.setGstCertificateUrl(fileUrl);
                        break;
                    case "cancelled_cheque":
                        vendorProfile.setCancelledChequeUrl(fileUrl);
                        break;
                    case "pan_card":
                        vendorProfile.setPanCardUrl(fileUrl);
                        break;
                    case "identity_proof":
                        vendorProfile.setIdentityProofUrl(fileUrl);
                        break;
                    default:
                        throw new RuntimeException("Invalid document type: " + documentType);
                }
                
                vendorProfileRepository.save(vendorProfile);
            }
            
            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    /**
     * Create a new vendor profile for an existing user
     * @param userId the user ID
     * @param requestDto vendor profile data
     * @return VendorProfileResponseDto
     * @throws RuntimeException if user not found or profile already exists
     */
    public VendorProfileResponseDto createVendorProfile(Integer userId, VendorProfileCreateRequestDto requestDto) {
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if vendor profile already exists for this user
        if (vendorProfileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Vendor profile already exists for this user");
        }

        // Check if GST number is unique (only for non-temporary GST numbers)
        if (!requestDto.isTemporaryGst() && vendorProfileRepository.existsByGstNumber(requestDto.getGstNumber())) {
            throw new RuntimeException("GST number already registered");
        }
        
        // Validate GST number format if it's not a temporary one
        if (!requestDto.isTemporaryGst()) {
            String gstRegex = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$";
            if (!requestDto.getGstNumber().matches(gstRegex)) {
                throw new RuntimeException("Invalid GST number format. Please enter a valid 15-character GST number.");
            }
        }

        // Create new vendor profile
        VendorProfile vendorProfile = VendorProfileMapper.toEntity(requestDto, user);
        
        // Save to database
        VendorProfile savedProfile = vendorProfileRepository.save(vendorProfile);
        
        return VendorProfileMapper.toResponseDto(savedProfile);
    }

    /**
     * Get vendor profile by ID
     * @param vendorId vendor profile ID
     * @return VendorProfileResponseDto
     * @throws RuntimeException if vendor profile not found
     */
    @Transactional(readOnly = true)
    public VendorProfileResponseDto getVendorProfileById(Integer vendorId) {
        VendorProfile vendorProfile = vendorProfileRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor profile not found with id: " + vendorId));
        
        return VendorProfileMapper.toResponseDto(vendorProfile);
    }

    /**
     * Get vendor profile by user ID
     * @param userId user ID
     * @return VendorProfileResponseDto or null if not found
     */
    @Transactional(readOnly = true)
    public VendorProfileResponseDto getVendorProfileByUserId(Integer userId) {
        try {
            VendorProfile vendorProfile = vendorProfileRepository.findByUserId(userId)
                .orElse(null);
                
            if (vendorProfile == null) {
                return null; // Return null instead of throwing exception
            }
            
            return VendorProfileMapper.toResponseDto(vendorProfile);
        } catch (Exception e) {
            return null; // Return null for any other errors
        }
    }

    /**
     * Check if vendor profile exists for user
     * @param userId user ID
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean existsByUserId(Integer userId) {
        return vendorProfileRepository.findByUserId(userId).isPresent();
    }

    /**
     * Get all vendor profiles with pagination
     * @param pageable pagination information
     * @return Page<VendorProfileResponseDto>
     */
    @Transactional(readOnly = true)
    public Page<VendorProfileResponseDto> getAllVendorProfiles(Pageable pageable) {
        return vendorProfileRepository.findAll(pageable)
            .map(VendorProfileMapper::toResponseDto);
    }

    /**
     * Get vendor profiles by status with pagination
     * @param status vendor status
     * @param pageable pagination information
     * @return Page<VendorProfileResponseDto>
     */
    @Transactional(readOnly = true)
    public Page<VendorProfileResponseDto> getVendorProfilesByStatus(VendorStatus status, Pageable pageable) {
        return vendorProfileRepository.findByStatus(status, pageable)
            .map(VendorProfileMapper::toResponseDto);
    }

    /**
     * Get all pending vendor profiles
     * @return List<VendorProfileResponseDto>
     */
    @Transactional(readOnly = true)
    public List<VendorProfileResponseDto> getPendingVendorProfiles() {
        return vendorProfileRepository.findByStatus(VendorStatus.PENDING).stream()
            .map(VendorProfileMapper::toResponseDto)
            .collect(Collectors.toList());
    }

    /**
     * Update vendor profile
     * @param vendorId vendor profile ID
     * @param requestDto updated vendor profile data
     * @return VendorProfileResponseDto
     * @throws RuntimeException if vendor profile not found or GST number already exists
     */
    public VendorProfileResponseDto updateVendorProfile(Integer vendorId, VendorProfileCreateRequestDto requestDto) {
        VendorProfile vendorProfile = vendorProfileRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor profile not found with id: " + vendorId));
        
        // Check if GST number is changed and unique
        if (!vendorProfile.getGstNumber().equals(requestDto.getGstNumber()) && 
            vendorProfileRepository.existsByGstNumber(requestDto.getGstNumber())) {
            throw new RuntimeException("GST number already registered");
        }

        // Update vendor profile
        VendorProfile updatedProfile = VendorProfileMapper.updateEntity(vendorProfile, requestDto);
        VendorProfile savedProfile = vendorProfileRepository.save(updatedProfile);
        
        return VendorProfileMapper.toResponseDto(savedProfile);
    }

    /**
     * Update vendor profile status
     * @param vendorId vendor profile ID
     * @param status new vendor status
     * @return VendorProfileResponseDto
     * @throws RuntimeException if vendor profile not found
     */
    public VendorProfileResponseDto updateVendorStatus(Integer vendorId, VendorStatus status) {
        VendorProfile vendorProfile = vendorProfileRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor profile not found with id: " + vendorId));
        
        vendorProfile.setStatus(status);
        VendorProfile savedProfile = vendorProfileRepository.save(vendorProfile);
        
        return VendorProfileMapper.toResponseDto(savedProfile);
    }

    /**
     * Delete vendor profile
     * @param vendorId vendor profile ID
     * @throws RuntimeException if vendor profile not found
     */
    public void deleteVendorProfile(Integer vendorId) {
        if (!vendorProfileRepository.existsById(vendorId)) {
            throw new RuntimeException("Vendor profile not found with id: " + vendorId);
        }
        vendorProfileRepository.deleteById(vendorId);
    }

    /**
     * Count vendor profiles by status
     * @param status vendor status
     * @return long count
     */
    @Transactional(readOnly = true)
    public long countByStatus(VendorStatus status) {
        return vendorProfileRepository.countByStatus(status);
    }
} 