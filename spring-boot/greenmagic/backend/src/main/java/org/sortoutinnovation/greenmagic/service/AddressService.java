package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.model.Address;
import org.sortoutinnovation.greenmagic.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class for Address business logic
 * Handles user address management operations
 */
@Service
@Transactional
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    /**
     * Get all addresses for a user
     * @param userId user ID
     * @return List<Address>
     */
    @Transactional(readOnly = true)
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    /**
     * Get address by ID
     * @param id address ID
     * @return Address
     * @throws RuntimeException if address not found
     */
    @Transactional(readOnly = true)
    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }

    /**
     * Create a new address
     * @param address address data
     * @return Address
     */
    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }

    /**
     * Update address
     * @param id address ID
     * @param updatedAddress updated address data
     * @return Address
     * @throws RuntimeException if address not found
     */
    public Address updateAddress(Long id, Address updatedAddress) {
        Address existingAddress = addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));

        // Update fields
        if (updatedAddress.getAddressLine() != null) {
            existingAddress.setAddressLine(updatedAddress.getAddressLine());
        }
        if (updatedAddress.getCity() != null) {
            existingAddress.setCity(updatedAddress.getCity());
        }
        if (updatedAddress.getState() != null) {
            existingAddress.setState(updatedAddress.getState());
        }
        if (updatedAddress.getZipCode() != null) {
            existingAddress.setZipCode(updatedAddress.getZipCode());
        }
        if (updatedAddress.getCountry() != null) {
            existingAddress.setCountry(updatedAddress.getCountry());
        }
        if (updatedAddress.getName() != null) {
            existingAddress.setName(updatedAddress.getName());
        }
        if (updatedAddress.getPhoneNumber() != null) {
            existingAddress.setPhoneNumber(updatedAddress.getPhoneNumber());
        }
        if (updatedAddress.getAddressType() != null) {
            existingAddress.setAddressType(updatedAddress.getAddressType());
        }
        if (updatedAddress.getIsDefault() != null) {
            existingAddress.setIsDefault(updatedAddress.getIsDefault());
        }

        return addressRepository.save(existingAddress);
    }

    /**
     * Delete address
     * @param id address ID
     * @throws RuntimeException if address not found
     */
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new RuntimeException("Address not found with id: " + id);
        }
        addressRepository.deleteById(id);
    }

    /**
     * Get default address for user
     * @param userId user ID
     * @return Address
     */
    @Transactional(readOnly = true)
    public Address getDefaultAddress(Long userId) {
        return addressRepository.findDefaultAddressByUserId(userId).orElse(null);
    }

    /**
     * Set address as default
     * @param userId user ID
     * @param addressId address ID
     * @return Address
     * @throws RuntimeException if address not found
     */
    public Address setDefaultAddress(Long userId, Long addressId) {
        // First, unset all default addresses for the user
        List<Address> userAddresses = addressRepository.findByUserId(userId);
        for (Address addr : userAddresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }

        // Set the specified address as default
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
        
        address.setIsDefault(true);
        return addressRepository.save(address);
    }
} 