package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Entity representing orders in the e-commerce system
 * Maps to the 'orders' table in the database
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", referencedColumnName = "address_id")
    private Address address;

    @DecimalMin(value = "0.00", message = "Total price must be greater than or equal to 0")
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Column(name = "status", length = 50)
    private String status;

    @Size(max = 50, message = "Payment method must not exceed 50 characters")
    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "Cash on Delivery";

    @CreationTimestamp
    @Column(name = "order_date", updatable = false)
    private LocalDateTime orderDate;

    @DecimalMin(value = "0.00", message = "Subtotal must be greater than or equal to 0")
    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Total tax must be greater than or equal to 0")
    @Column(name = "total_tax", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalTax = BigDecimal.ZERO;

    @Size(max = 255, message = "Payment ID must not exceed 255 characters")
    @Column(name = "payment_id", length = 255)
    private String paymentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Size(max = 50, message = "Payment gateway must not exceed 50 characters")
    @Column(name = "payment_gateway", length = 50)
    private String paymentGateway;

    @Size(max = 255, message = "Payment transaction ID must not exceed 255 characters")
    @Column(name = "payment_transaction_id", length = 255)
    private String paymentTransactionId;

    @DecimalMin(value = "0.00", message = "Payment amount must be greater than or equal to 0")
    @Column(name = "payment_amount", precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Size(max = 3, message = "Payment currency must not exceed 3 characters")
    @Column(name = "payment_currency", length = 3)
    private String paymentCurrency = "INR";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payment_details", columnDefinition = "JSON")
    private Object paymentDetails;

    @Size(max = 255, message = "Razorpay order ID must not exceed 255 characters")
    @Column(name = "razorpay_order_id", length = 255)
    private String razorpayOrderId;

    @Size(max = 255, message = "Razorpay payment ID must not exceed 255 characters")
    @Column(name = "razorpay_payment_id", length = 255)
    private String razorpayPaymentId;

    @Size(max = 255, message = "Razorpay signature must not exceed 255 characters")
    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;

    public enum PaymentStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
    }

    public Order(User user, Address address, BigDecimal totalPrice, String status, String paymentMethod) {
        this.user = user;
        this.address = address;
        this.totalPrice = totalPrice;
        this.status = status;
        this.paymentMethod = paymentMethod;
    }
} 