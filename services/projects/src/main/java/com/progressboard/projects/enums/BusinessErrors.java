package com.progressboard.projects.enums;

import com.platform.web.exception.ErrorDefinition;

public enum BusinessErrors implements ErrorDefinition {
    DUPLICATE_ELEMENT("DUPLICATE_ELEMENT", "BUS-0001", "Element already exists in record."),
    INVALID_PARTICIPANT("INVALID_PARTICIPANT", "BUS-0002", "Member doen't belong to this project."),
    FORBIDDEN("FORBIDDEN", "BUS-0003", "You are not allowed to perform this operation."),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "BUS-0004", "Resource not found");

    private String errorName;
    private String errorCode;
    private String errorMessage;

    BusinessErrors(String errorName,
            String errorCode,
            String errorMessage) {
        this.errorName = errorName;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    @Override
    public String getErrorName() {
        return errorName;
    }

    @Override
    public String getErrorCode() {
        return errorCode;
    }

    @Override
    public String getErrorMessage() {
        return errorMessage;
    }

}
