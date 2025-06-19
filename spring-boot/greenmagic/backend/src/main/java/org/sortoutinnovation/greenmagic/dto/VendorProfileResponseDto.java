package org.sortoutinnovation.greenmagic.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private String gstNumber;
    private String businessPhone;
    private String businessEmail;
    private String address;
    private String storeDescription;
    private String logoUrl;
    private VendorStatus status;
    private LocalDateTime createdAt;
} 