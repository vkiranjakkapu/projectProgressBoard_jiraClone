package com.progressboard.projects.services.imp;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import com.progressboard.projects.dto.RestResponseDto;
import com.progressboard.projects.dto.UserResponseDto;
import com.progressboard.projects.exceptions.BusinessException;
import com.progressboard.projects.exceptions.InternalCommunicationException;
import com.progressboard.projects.services.IdentityService;

@Service
public class IdentityServiceImp implements IdentityService {

    private final RestClient restClient;

    @Value("${services.uri.identity}")
    private String IDENTITY_SERVICE_URL;

    public IdentityServiceImp(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        try {
            return restClient.get().uri(IDENTITY_SERVICE_URL + "/users/").retrieve()
                    .body(new ParameterizedTypeReference<RestResponseDto<List<UserResponseDto>>>() {
                    }).getData();
        } catch (HttpStatusCodeException e) {
            String rawResponse = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawResponse, e.getStatusCode());
        } catch (Exception e) {
            throw new BusinessException("Error Connecting with Identity Service");
        }
    }

    @Override
    public Map<UUID, UserResponseDto> getAllUsersByIds(Set<UUID> userIds) {
        return fetchUsers(userIds).stream()
                .collect(Collectors.toMap(UserResponseDto::id, x -> x));
    }

    private List<UserResponseDto> fetchUsers(Set<UUID> ids) {
        try {
            RestResponseDto<List<UserResponseDto>> body = restClient.post().uri(IDENTITY_SERVICE_URL + "/users/search")
                    .body(Map.entry("ids", ids))
                    .retrieve().body(new ParameterizedTypeReference<RestResponseDto<List<UserResponseDto>>>() {
                    });
            return body.getData();
        } catch (HttpStatusCodeException e) {
            String rawJsonResponseBody = e.getResponseBodyAsString();
            throw new InternalCommunicationException(rawJsonResponseBody, e.getStatusCode());
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
    }
}
