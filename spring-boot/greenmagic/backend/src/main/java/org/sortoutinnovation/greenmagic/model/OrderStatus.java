package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing order status history and tracking
 * Maps to the 'order_status_history' table in the database
 */
@Entity
@Table(name = "order_status_history", indexes = {
    @Index(name = "idx_order_status_order_id", columnList = "order_id"),
    @Index(name = "idx_order_status_timestamp", columnList = "status_timestamp"),
    @Index(name = "idx_order_status_current", columnList = "is_current")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Long statusId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusType status;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private StatusType previousStatus;

    @Column(name = "status_timestamp", nullable = false)
    private LocalDateTime statusTimestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "user_id")
    private User updatedBy;

    @Size(max = 500, message = "Status notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    @Size(max = 100, message = "Tracking number must not exceed 100 characters")
    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Size(max = 50, message = "Courier service must not exceed 50 characters")
    @Column(name = "courier_service", length = 50)
    private String courierService;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDateTime actualDeliveryDate;

    @Column(name = "sla_deadline")
    private LocalDateTime slaDeadline;

    @Column(name = "is_sla_breached")
    private Boolean isSlaBreached = false;

    @Column(name = "is_current")
    private Boolean isCurrent = true;

    @Column(name = "auto_updated")
    private Boolean autoUpdated = false;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    @Column(name = "current_location", length = 100)
    private String currentLocation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum StatusType {
        NEW("Order Placed", 0, 24),
        ACCEPTED("Order Accepted", 1, 2),
        PROCESSING("Preparing Order", 2, 24),
        READY_TO_SHIP("Ready to Ship", 3, 12),
        SHIPPED("Shipped", 4, 72),
        OUT_FOR_DELIVERY("Out for Delivery", 5, 24),
        DELIVERED("Delivered", 6, -1),
        CANCELLED("Cancelled", -1, -1),
        RETURNED("Returned", -1, -1),
        REFUNDED("Refunded", -1, -1);

        private final String displayName;
        private final int sequenceOrder;
        private final int slaHours; // -1 means no SLA

        StatusType(String displayName, int sequenceOrder, int slaHours) {
            this.displayName = displayName;
            this.sequenceOrder = sequenceOrder;
            this.slaHours = slaHours;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getSequenceOrder() {
            return sequenceOrder;
        }

        public int getSlaHours() {
            return slaHours;
        }

        public boolean hasSla() {
            return slaHours > 0;
        }

        public boolean isTerminalStatus() {
            return this == DELIVERED || this == CANCELLED || this == RETURNED || this == REFUNDED;
        }

        public boolean canTransitionTo(StatusType newStatus) {
            // Terminal statuses can't transition to other statuses
            if (this.isTerminalStatus()) {
                return false;
            }

            // Allow cancellation from any non-terminal status
            if (newStatus == CANCELLED) {
                return !this.isTerminalStatus();
            }

            // Allow return only after delivery
            if (newStatus == RETURNED) {
                return this == DELIVERED;
            }

            // Allow refund after cancellation or return
            if (newStatus == REFUNDED) {
                return this == CANCELLED || this == RETURNED;
            }

            // For normal flow, new status should be next in sequence
            return newStatus.sequenceOrder == this.sequenceOrder + 1;
        }
    }

    // Helper methods
    public boolean isSlaApplicable() {
        return status.hasSla();
    }

    public LocalDateTime calculateSlaDeadline() {
        if (!isSlaApplicable()) {
            return null;
        }
        return statusTimestamp.plusHours(status.getSlaHours());
    }

    public boolean isSlaBreached() {
        if (!isSlaApplicable() || slaDeadline == null) {
            return false;
        }
        return LocalDateTime.now().isAfter(slaDeadline) && !status.isTerminalStatus();
    }

    public long getHoursInCurrentStatus() {
        return java.time.Duration.between(statusTimestamp, LocalDateTime.now()).toHours();
    }

    public long getHoursUntilSlaDeadline() {
        if (slaDeadline == null) {
            return -1;
        }
        long hours = java.time.Duration.between(LocalDateTime.now(), slaDeadline).toHours();
        return Math.max(0, hours);
    }
} 