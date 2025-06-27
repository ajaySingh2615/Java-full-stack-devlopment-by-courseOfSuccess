package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileCompletionDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.VendorProfileResponseDto;
import org.sortoutinnovation.greenmagic.model.VendorProfile.VendorStatus;
import org.sortoutinnovation.greenmagic.service.VendorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for Vendor Profile management endpoints
 */
@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorProfileController {

    @Autowired
    private VendorProfileService vendorProfileService;

    /**
     * Complete vendor profile (step 2 of vendor registration)
     * @param userId ID of the user (vendor)
     * @param profileDto profile completion data
     * @return created vendor profile
     */
    @PostMapping("/users/{userId}/complete-profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> completeVendorProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody VendorProfileCompletionDto profileDto) {
        try {
            VendorProfileResponseDto createdProfile = vendorProfileService.completeVendorProfile(userId, profileDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Vendor profile created successfully. Your profile is pending approval.",
                "vendorProfile", createdProfile
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create vendor profile",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Upload document for vendor profile
     * @param userId ID of the user (vendor)
     * @param documentType type of document (logo, gst_certificate, cancelled_cheque, pan_card, identity_proof)
     * @param file document file
     * @return updated vendor profile
     */
    @PostMapping("/users/{userId}/documents/{documentType}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<?> uploadDocument(
            @PathVariable Integer userId,
            @PathVariable String documentType,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = vendorProfileService.uploadVendorDocument(userId, documentType, file);
            return ResponseEntity.ok(Map.of(
                "message", "Document uploaded successfully",
                "fileUrl", fileUrl,
                "documentType", documentType
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to upload document",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Create a new vendor profile for a user
     * @param userId user ID
     * @param requestDto vendor profile data
     * @return created vendor profile
     */
    @PostMapping("/users/{userId}")
    public ResponseEntity<ApiResponseDto<VendorProfileResponseDto>> createVendorProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody VendorProfileCreateRequestDto requestDto) {
        try {
            VendorProfileResponseDto vendorProfile = vendorProfileService.createVendorProfile(userId, requestDto);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile created successfully. Pending admin approval.",
                vendorProfile
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Get vendor profile by ID
     * @param vendorId vendor profile ID
     * @return vendor profile
     */
    @GetMapping("/{vendorId}")
    public ResponseEntity<ApiResponseDto<VendorProfileResponseDto>> getVendorProfile(@PathVariable Integer vendorId) {
        try {
            VendorProfileResponseDto vendorProfile = vendorProfileService.getVendorProfileById(vendorId);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile retrieved successfully",
                vendorProfile
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Get vendor profile by user ID
     * @param userId user ID
     * @return vendor profile
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponseDto<VendorProfileResponseDto>> getVendorProfileByUserId(@PathVariable Integer userId) {
        try {
            VendorProfileResponseDto vendorProfile = vendorProfileService.getVendorProfileByUserId(userId);
            
            if (vendorProfile == null) {
                return ResponseEntity.ok(new ApiResponseDto<>(
                    false,
                    "No vendor profile found for user ID: " + userId,
                    null
                ));
            }
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile retrieved successfully",
                vendorProfile
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Check if user has a vendor profile
     * @param userId user ID
     * @return boolean result
     */
    @GetMapping("/users/{userId}/exists")
    public ResponseEntity<ApiResponseDto<Boolean>> vendorProfileExists(@PathVariable Integer userId) {
        boolean exists = vendorProfileService.existsByUserId(userId);
        
        return ResponseEntity.ok(new ApiResponseDto<>(
            true,
            exists ? "Vendor profile exists for this user" : "No vendor profile found for this user",
            exists
        ));
    }

    /**
     * Get all vendor profiles with pagination
     * @param page page number
     * @param size page size
     * @param sortBy sort field
     * @param sortDir sort direction
     * @return paged list of vendor profiles
     */
    @GetMapping
    public ResponseEntity<ApiResponseDto<Page<VendorProfileResponseDto>>> getAllVendorProfiles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("asc") ? 
                Sort.by(sortBy).ascending() : 
                Sort.by(sortBy).descending();
                
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<VendorProfileResponseDto> vendorProfiles = vendorProfileService.getAllVendorProfiles(pageable);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profiles retrieved successfully",
                vendorProfiles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Get vendor profiles by status with pagination
     * @param status vendor status
     * @param page page number
     * @param size page size
     * @return paged list of vendor profiles
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponseDto<Page<VendorProfileResponseDto>>> getVendorProfilesByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            VendorStatus vendorStatus = VendorStatus.valueOf(status.toUpperCase());
            Pageable pageable = PageRequest.of(page, size);
            Page<VendorProfileResponseDto> vendorProfiles = vendorProfileService.getVendorProfilesByStatus(vendorStatus, pageable);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profiles retrieved successfully",
                vendorProfiles
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                "Invalid vendor status: " + status,
                null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Get all pending vendor profiles
     * @return list of pending vendor profiles
     */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponseDto<List<VendorProfileResponseDto>>> getPendingVendorProfiles() {
        try {
            List<VendorProfileResponseDto> pendingProfiles = vendorProfileService.getPendingVendorProfiles();
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Pending vendor profiles retrieved successfully",
                pendingProfiles
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Update vendor profile
     * @param vendorId vendor profile ID
     * @param requestDto updated vendor profile data
     * @return updated vendor profile
     */
    @PutMapping("/{vendorId}")
    public ResponseEntity<ApiResponseDto<VendorProfileResponseDto>> updateVendorProfile(
            @PathVariable Integer vendorId,
            @Valid @RequestBody VendorProfileCreateRequestDto requestDto) {
        try {
            VendorProfileResponseDto updatedProfile = vendorProfileService.updateVendorProfile(vendorId, requestDto);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile updated successfully",
                updatedProfile
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Update vendor profile status
     * @param vendorId vendor profile ID
     * @param status new vendor status
     * @return updated vendor profile
     */
    @PutMapping("/{vendorId}/status/{status}")
    public ResponseEntity<ApiResponseDto<VendorProfileResponseDto>> updateVendorStatus(
            @PathVariable Integer vendorId,
            @PathVariable String status) {
        try {
            VendorStatus vendorStatus = VendorStatus.valueOf(status.toUpperCase());
            VendorProfileResponseDto updatedProfile = vendorProfileService.updateVendorStatus(vendorId, vendorStatus);
            
            String message = switch(vendorStatus) {
                case APPROVED -> "Vendor profile approved successfully";
                case REJECTED -> "Vendor profile rejected";
                case PENDING -> "Vendor profile status set to pending";
                default -> "Vendor profile status updated";
            };
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                message,
                updatedProfile
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                "Invalid vendor status: " + status,
                null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Delete vendor profile
     * @param vendorId vendor profile ID
     * @return success message
     */
    @DeleteMapping("/{vendorId}")
    public ResponseEntity<ApiResponseDto<Void>> deleteVendorProfile(@PathVariable Integer vendorId) {
        try {
            vendorProfileService.deleteVendorProfile(vendorId);
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile deleted successfully",
                null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }

    /**
     * Get vendor profile counts by status
     * @return map of status counts
     */
    @GetMapping("/stats/counts")
    public ResponseEntity<ApiResponseDto<Map<String, Long>>> getVendorProfileCounts() {
        try {
            Map<String, Long> counts = new HashMap<>();
            counts.put("PENDING", vendorProfileService.countByStatus(VendorStatus.PENDING));
            counts.put("APPROVED", vendorProfileService.countByStatus(VendorStatus.APPROVED));
            counts.put("REJECTED", vendorProfileService.countByStatus(VendorStatus.REJECTED));
            counts.put("TOTAL", vendorProfileService.countByStatus(VendorStatus.PENDING) + 
                               vendorProfileService.countByStatus(VendorStatus.APPROVED) + 
                               vendorProfileService.countByStatus(VendorStatus.REJECTED));
            
            return ResponseEntity.ok(new ApiResponseDto<>(
                true,
                "Vendor profile counts retrieved successfully",
                counts
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponseDto<>(
                false,
                e.getMessage(),
                null
            ));
        }
    }
} 