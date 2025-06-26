package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing financial transactions for vendors
 * Maps to the 'financial_transactions' table in the database
 */
@Entity
@Table(name = "financial_transactions", indexes = {
    @Index(name = "idx_financial_vendor", columnList = "vendor_id"),
    @Index(name = "idx_financial_order", columnList = "order_id"),
    @Index(name = "idx_financial_type", columnList = "transaction_type"),
    @Index(name = "idx_financial_date", columnList = "transaction_date"),
    @Index(name = "idx_financial_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", referencedColumnName = "vendor_id", nullable = false)
    private VendorProfile vendorProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private TransactionCategory category;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(name = "amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @NotNull(message = "Transaction date is required")
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Size(max = 100, message = "Reference number must not exceed 100 characters")
    @Column(name = "reference_number", length = 100, unique = true)
    private String referenceNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;

    // GST and Tax Details
    @DecimalMin(value = "0.00", message = "Tax amount must be greater than or equal to 0")
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "CGST must be greater than or equal to 0")
    @Column(name = "cgst_amount", precision = 10, scale = 2)
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "SGST must be greater than or equal to 0")
    @Column(name = "sgst_amount", precision = 10, scale = 2)
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "IGST must be greater than or equal to 0")
    @Column(name = "igst_amount", precision = 10, scale = 2)
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "TDS amount must be greater than or equal to 0")
    @Column(name = "tds_amount", precision = 10, scale = 2)
    private BigDecimal tdsAmount = BigDecimal.ZERO;

    // Commission and Fee Details
    @DecimalMin(value = "0.00", message = "Platform commission must be greater than or equal to 0")
    @Column(name = "platform_commission", precision = 10, scale = 2)
    private BigDecimal platformCommission = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Payment gateway fee must be greater than or equal to 0")
    @Column(name = "payment_gateway_fee", precision = 10, scale = 2)
    private BigDecimal paymentGatewayFee = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Processing fee must be greater than or equal to 0")
    @Column(name = "processing_fee", precision = 10, scale = 2)
    private BigDecimal processingFee = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Net amount must be greater than or equal to 0")
    @Column(name = "net_amount", precision = 12, scale = 2)
    private BigDecimal netAmount;

    // Payment Details
    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Size(max = 100, message = "Payment reference must not exceed 100 characters")
    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "settlement_date")
    private LocalDateTime settlementDate;

    // Additional Details
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "additional_details", columnDefinition = "JSON")
    private Object additionalDetails;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "user_id")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TransactionType {
        CREDIT("Credit - Money In", true),
        DEBIT("Debit - Money Out", false);

        private final String displayName;
        private final boolean isCredit;

        TransactionType(String displayName, boolean isCredit) {
            this.displayName = displayName;
            this.isCredit = isCredit;
        }

        public String getDisplayName() {
            return displayName;
        }

        public boolean isCredit() {
            return isCredit;
        }

        public boolean isDebit() {
            return !isCredit;
        }
    }

    public enum TransactionCategory {
        // Credit Categories
        SALE_REVENUE("Sale Revenue"),
        REFUND_REVERSAL("Refund Reversal"),
        BONUS_CREDIT("Bonus Credit"),
        WALLET_CREDIT("Wallet Credit"),
        
        // Debit Categories
        PLATFORM_COMMISSION("Platform Commission"),
        PAYMENT_GATEWAY_FEE("Payment Gateway Fee"),
        TDS_DEDUCTION("TDS Deduction"),
        REFUND_PAYMENT("Refund Payment"),
        PENALTY("Penalty"),
        WITHDRAWAL("Withdrawal"),
        ADJUSTMENT("Adjustment");

        private final String displayName;

        TransactionCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }

        public boolean isCreditCategory() {
            return this == SALE_REVENUE || this == REFUND_REVERSAL || 
                   this == BONUS_CREDIT || this == WALLET_CREDIT;
        }

        public boolean isDebitCategory() {
            return !isCreditCategory();
        }
    }

    public enum TransactionStatus {
        PENDING("Pending", false),
        PROCESSING("Processing", false),
        COMPLETED("Completed", true),
        FAILED("Failed", true),
        CANCELLED("Cancelled", true),
        REFUNDED("Refunded", true);

        private final String displayName;
        private final boolean isTerminal;

        TransactionStatus(String displayName, boolean isTerminal) {
            this.displayName = displayName;
            this.isTerminal = isTerminal;
        }

        public String getDisplayName() {
            return displayName;
        }

        public boolean isTerminal() {
            return isTerminal;
        }

        public boolean isPending() {
            return this == PENDING;
        }

        public boolean isCompleted() {
            return this == COMPLETED;
        }

        public boolean isFailed() {
            return this == FAILED;
        }
    }

    // Helper methods
    public BigDecimal calculateNetAmount() {
        BigDecimal totalDeductions = BigDecimal.ZERO;
        
        if (taxAmount != null) totalDeductions = totalDeductions.add(taxAmount);
        if (tdsAmount != null) totalDeductions = totalDeductions.add(tdsAmount);
        if (platformCommission != null) totalDeductions = totalDeductions.add(platformCommission);
        if (paymentGatewayFee != null) totalDeductions = totalDeductions.add(paymentGatewayFee);
        if (processingFee != null) totalDeductions = totalDeductions.add(processingFee);

        return amount.subtract(totalDeductions);
    }

    public BigDecimal getTotalTaxAmount() {
        BigDecimal total = BigDecimal.ZERO;
        if (cgstAmount != null) total = total.add(cgstAmount);
        if (sgstAmount != null) total = total.add(sgstAmount);
        if (igstAmount != null) total = total.add(igstAmount);
        return total;
    }

    public BigDecimal getTotalFeesAndCommissions() {
        BigDecimal total = BigDecimal.ZERO;
        if (platformCommission != null) total = total.add(platformCommission);
        if (paymentGatewayFee != null) total = total.add(paymentGatewayFee);
        if (processingFee != null) total = total.add(processingFee);
        return total;
    }

    public boolean isSettled() {
        return settlementDate != null && status == TransactionStatus.COMPLETED;
    }

    public long getDaysToSettle() {
        if (isSettled()) return 0;
        return java.time.Duration.between(transactionDate, LocalDateTime.now()).toDays();
    }

    // Auto-calculate net amount before persisting
    @PrePersist
    @PreUpdate
    public void calculateNetAmountBeforeSave() {
        this.netAmount = calculateNetAmount();
        this.taxAmount = getTotalTaxAmount();
        this.updatedAt = LocalDateTime.now();
    }
} 