package com.progressboard.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.progressboard.identity.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
