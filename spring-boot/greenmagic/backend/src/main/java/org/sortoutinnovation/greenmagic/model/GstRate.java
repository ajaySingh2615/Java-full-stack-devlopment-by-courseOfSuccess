package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entity representing GST rates for tax calculation
 * Maps to the 'gst_rates' table in the database
 */
@Entity
@Table(name = "gst_rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GstRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rate_id")
    private Integer rateId;

    @NotBlank(message = "Rate name is required")
    @Size(max = 50, message = "Rate name must not exceed 50 characters")
    @Column(name = "rate_name", nullable = false, length = 50)
    private String rateName;

    @NotNull(message = "Percentage is required")
    @DecimalMin(value = "0.00", message = "Percentage must be greater than or equal to 0")
    @DecimalMax(value = "100.00", message = "Percentage must be less than or equal to 100")
    @Column(name = "percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "defaultGstRate", fetch = FetchType.LAZY)
    private Set<HsnCode> hsnCodes;

    @OneToMany(mappedBy = "customGstRate", fetch = FetchType.LAZY)
    private Set<Product> products;

    public GstRate(String rateName, BigDecimal percentage, String description) {
        this.rateName = rateName;
        this.percentage = percentage;
        this.description = description;
    }
} 