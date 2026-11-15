package com.progressboard.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {

    private Long id;

    private String street;

    private String pinCode;

    private String state;

    private String country;

    @Builder.Default()
    private boolean deleted = false;

}