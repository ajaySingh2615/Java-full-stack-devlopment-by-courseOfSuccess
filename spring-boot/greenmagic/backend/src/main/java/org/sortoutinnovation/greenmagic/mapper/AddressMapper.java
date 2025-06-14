package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.AddressCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.AddressResponseDto;
import org.sortoutinnovation.greenmagic.model.Address;
import org.sortoutinnovation.greenmagic.model.User;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for Address entity and DTOs
 */
public class AddressMapper {

    public static AddressResponseDto toResponseDto(Address address) {
        if (address == null) {
            return null;
        }

        AddressResponseDto dto = new AddressResponseDto();
        dto.setAddressId(address.getAddressId());
        dto.setName(address.getName());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        dto.setPhoneNumber(address.getPhoneNumber());
        dto.setIsDefault(address.getIsDefault());
        dto.setAddressType(address.getAddressType() != null ? address.getAddressType().name() : "HOME");
        dto.setCreatedAt(address.getCreatedAt());

        return dto;
    }

    public static List<AddressResponseDto> toResponseDtoList(List<Address> addresses) {
        if (addresses == null) {
            return null;
        }
        
        return addresses.stream()
                .map(AddressMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public static Address toEntity(AddressCreateRequestDto dto, User user) {
        if (dto == null) {
            return null;
        }

        Address address = new Address();
        address.setName(dto.getName());
        address.setAddressLine(dto.getAddressLine());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        address.setAddressType(dto.getAddressType() != null ? dto.getAddressType() : Address.AddressType.HOME);
        address.setUser(user);

        return address;
    }

    public static void updateEntity(Address address, AddressCreateRequestDto dto) {
        if (address == null || dto == null) {
            return;
        }

        address.setName(dto.getName());
        address.setAddressLine(dto.getAddressLine());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
        address.setPhoneNumber(dto.getPhoneNumber());
        address.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        address.setAddressType(dto.getAddressType() != null ? dto.getAddressType() : Address.AddressType.HOME);
    }
} 