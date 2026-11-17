package com.progressboard.identity.dto;

import lombok.Builder;

@Builder
public record AddressDto(String street,
		String pinCode,
		String state,
		String country) {

}
