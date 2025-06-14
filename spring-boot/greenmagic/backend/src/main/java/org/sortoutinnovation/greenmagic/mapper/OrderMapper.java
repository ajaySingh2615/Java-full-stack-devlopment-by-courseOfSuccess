package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.OrderResponseDto;
import org.sortoutinnovation.greenmagic.model.Order;
import org.sortoutinnovation.greenmagic.model.OrderItem;
import org.sortoutinnovation.greenmagic.model.Address;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for Order entity and DTOs
 */
public class OrderMapper {

    public static OrderResponseDto toResponseDto(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(order.getOrderId());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setSubtotal(order.getSubtotal());
        dto.setTotalTax(order.getTotalTax());
        dto.setPaymentCurrency(order.getPaymentCurrency());
        dto.setOrderDate(order.getOrderDate());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setRazorpayPaymentId(order.getRazorpayPaymentId());

        // Map address as shipping address
        if (order.getAddress() != null) {
            dto.setShippingAddress(toAddressDto(order.getAddress()));
        }

        // Map order items
        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                .map(OrderMapper::toOrderItemDto)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    public static OrderResponseDto toSummaryDto(Order order) {
        if (order == null) {
            return null;
        }

        return new OrderResponseDto(
            order.getOrderId(),
            order.getStatus(),
            order.getTotalPrice(),
            order.getOrderDate(),
            order.getPaymentStatus()
        );
    }

    public static List<OrderResponseDto> toResponseDtoList(List<Order> orders) {
        if (orders == null) {
            return null;
        }
        
        return orders.stream()
                .map(OrderMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public static List<OrderResponseDto> toSummaryDtoList(List<Order> orders) {
        if (orders == null) {
            return null;
        }
        
        return orders.stream()
                .map(OrderMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    private static OrderResponseDto.OrderItemResponseDto toOrderItemDto(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        OrderResponseDto.OrderItemResponseDto dto = new OrderResponseDto.OrderItemResponseDto();
        dto.setOrderItemId(orderItem.getOrderItemId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setTaxRate(orderItem.getTaxRate());
        dto.setTaxAmount(orderItem.getTaxAmount());
        dto.setHsnCode(orderItem.getHsnCode());

        if (orderItem.getProduct() != null) {
            dto.setProductId(orderItem.getProduct().getProductId());
            dto.setProductName(orderItem.getProduct().getName());
            dto.setProductImage(orderItem.getProduct().getImageUrl());
        }

        return dto;
    }

    private static OrderResponseDto.AddressDto toAddressDto(Address address) {
        if (address == null) {
            return null;
        }

        OrderResponseDto.AddressDto dto = new OrderResponseDto.AddressDto();
        dto.setAddressId(address.getAddressId());
        dto.setName(address.getName());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        dto.setPhoneNumber(address.getPhoneNumber());

        return dto;
    }
} 