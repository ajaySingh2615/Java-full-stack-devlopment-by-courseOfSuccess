package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entity representing order items (products within an order)
 * Maps to the 'order_items' table in the database
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private Product product;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity")
    private Integer quantity;

    @DecimalMin(value = "0.00", message = "Price must be greater than or equal to 0")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Tax rate must be greater than or equal to 0")
    @Column(name = "tax_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal taxRate = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Tax amount must be greater than or equal to 0")
    @Column(name = "tax_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Size(max = 20, message = "HSN code must not exceed 20 characters")
    @Column(name = "hsn_code", length = 20)
    private String hsnCode;

    public OrderItem(Order order, Product product, Integer quantity, BigDecimal price) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public OrderItem(Order order, Product product, Integer quantity, BigDecimal price, BigDecimal taxRate, BigDecimal taxAmount, String hsnCode) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.taxRate = taxRate;
        this.taxAmount = taxAmount;
        this.hsnCode = hsnCode;
    }
} 