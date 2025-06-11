package org.cadt.ecom.model;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderRequest {

    private Map<Long, Integer> productQuantities;
    private double totalAmount;

}
