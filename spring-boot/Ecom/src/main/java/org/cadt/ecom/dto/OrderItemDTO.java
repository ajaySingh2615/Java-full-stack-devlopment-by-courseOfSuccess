package org.cadt.ecom.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderItemDTO {

    private String productName;
    private double productPrice;
    private int quantity;
}
