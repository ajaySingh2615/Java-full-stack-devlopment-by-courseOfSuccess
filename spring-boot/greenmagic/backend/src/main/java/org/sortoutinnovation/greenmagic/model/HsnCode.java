package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entity representing HSN (Harmonized System of Nomenclature) codes for tax classification
 * Maps to the 'hsn_codes' table in the database
 */
@Entity
@Table(name = "hsn_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HsnCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hsn_id")
    private Integer hsnId;

    @NotBlank(message = "HSN code is required")
    @Size(max = 20, message = "HSN code must not exceed 20 characters")
    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_gst_rate_id", referencedColumnName = "rate_id")
    private GstRate defaultGstRate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "hsnCode", fetch = FetchType.LAZY)
    private Set<Product> products;

    public HsnCode(String code, String description, GstRate defaultGstRate) {
        this.code = code;
        this.description = description;
        this.defaultGstRate = defaultGstRate;
    }
} 