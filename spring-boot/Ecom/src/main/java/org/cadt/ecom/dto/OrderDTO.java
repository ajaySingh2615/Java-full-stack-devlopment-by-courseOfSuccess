package org.cadt.ecom.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderDTO {

    private Long id;
    private double totalAmount;
    private String status;
    private Date orderDate;
    private String userName;
    private String email;
    private List<OrderItemDTO> orderItems;

    public OrderDTO(Long id, double totalAmount, String status, Date orderDate, List<OrderItemDTO> orderItemDTOS) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.orderItems = orderItemDTOS;

    }
}
