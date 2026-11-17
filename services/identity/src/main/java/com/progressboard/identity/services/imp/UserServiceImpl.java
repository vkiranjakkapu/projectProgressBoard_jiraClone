package com.progressboard.identity.services.imp;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.platform.security.context.AuthenticationContext;
import com.platform.security.model.AuthenticatedUser;
import com.progressboard.identity.dto.CreateUserRequestDto;
import com.progressboard.identity.dto.PasswordChangeRequestDto;
import com.progressboard.identity.dto.RegistrationRequest;
import com.progressboard.identity.dto.UpdateUserRequest;
import com.progressboard.identity.dto.UserResponse;
import com.progressboard.identity.entities.Address;
import com.progressboard.identity.entities.Role;
import com.progressboard.identity.entities.RoleType;
import com.progressboard.identity.entities.User;
import com.progressboard.identity.enums.IdentityExceptions;
import com.progressboard.identity.exceptions.BusinessException;
import com.progressboard.identity.exceptions.EmailAlreadyUsedException;
import com.progressboard.identity.exceptions.ForbiddenException;
import com.progressboard.identity.exceptions.ResourceNotFoundException;
import com.progressboard.identity.repository.RoleRepository;
import com.progressboard.identity.repository.UserRepository;
import com.progressboard.identity.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationContext authenticationContext;

	@Override
	public UserResponse createUser(CreateUserRequestDto request) {

		AuthenticatedUser currentUser = authenticationContext.getCurrentUser().orElse(null);
		validatePermission(currentUser, request.role());

		if (userRepository.existsByEmail(request.email())) {
			throw new EmailAlreadyUsedException("Email already exists");
		}

		Role role = roleRepository.findByName(request.role())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		User user = User.builder()
				.roles(Set.of(role))
				.email(request.email())
				.phone(request.phone())
				.firstName(request.firstName())
				.lastName(request.lastName())
				.gender(request.gender())
				.build();

		Optional.ofNullable(request.password()).ifPresentOrElse(pass -> {
			user.setPassword(passwordEncoder.encode(pass));
		}, () -> {
			user.setPassword(passwordEncoder.encode("password"));
		});

		Optional.ofNullable(request.dob()).ifPresent(dob -> {
			user.setDob(dob);
		});

		Optional.ofNullable(request.address()).ifPresent(address -> {
			Address addr = new Address();
			Optional.ofNullable(address.street()).ifPresent(street -> {
				addr.setStreet(street);
			});
			Optional.ofNullable(address.pinCode()).ifPresent(pinCode -> {
				addr.setPinCode(pinCode);
			});
			Optional.ofNullable(address.state()).ifPresent(state -> {
				addr.setState(state);
			});
			Optional.ofNullable(address.country()).ifPresent(country -> {
				addr.setCountry(country);
			});
			user.setAddress(addr);
		});

		User saved = userRepository.save(user);

		return mapToResponse(saved, true);
	}

	private void validatePermission(AuthenticatedUser user, RoleType role) {
		if (user.getAuthorities().size() == 1) {
			String userRole = user.getAuthorities().stream().toList().getFirst();

			if (userRole.equalsIgnoreCase("ROLE_USER")) {
				throw new ForbiddenException("You are not allowed to create this user.");
			}

			if (userRole.equalsIgnoreCase("ROLE_MANAGER") && !role.equals(RoleType.USER)) {
				throw new ForbiddenException("You are not allowed to create this user.");
			}
		}

	}

	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsers() {

		return userRepository.findAllByDeletedFalse()
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	public List<UserResponse> getAllUsersByRole(RoleType type) {
		Role role = roleRepository.findByName(type)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + type));
		return userRepository.findAllByRolesAndDeletedFalse(role).stream().map(this::mapToResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsersWithIds(Collection<UUID> ids) {

		return userRepository.findByIdIn(ids)
				.stream()
				.map(this::mapToResponse)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getUserById(UUID id) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getUserByEmail(String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		return mapToResponse(user);
	}

	@Override
	public UserResponse register(RegistrationRequest request) {
		if (!request.password().equals(request.confirmPassword())) {
			throw new BusinessException(IdentityExceptions.REGISTRATION_ERROR, "Two Passwords didn't match!");
		}

		if (userRepository.existsByEmail(request.email())) {
			throw new EmailAlreadyUsedException("Email already exists");
		}

		RoleType roleType = Optional.ofNullable(request.type()).orElse(RoleType.USER);

		if (roleType.equals(RoleType.ADMIN)) {
			throw new BusinessException(IdentityExceptions.REGISTRATION_ERROR, "Role type not found.");
		}

		Role role = roleRepository.findByName(roleType)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		User user = User.builder()
				.email(request.email())
				.firstName(request.firstName())
				.lastName(request.lastName())
				.roles(Set.of(role))
				.password(passwordEncoder.encode(Optional.ofNullable(request.password()).orElse("password")))
				.address(Address.builder().build())
				.build();

		return mapToResponse(userRepository.save(user));
	}

	@Override
	public UserResponse updateUser(UUID id, UpdateUserRequest request) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setFirstName(request.firstName());
		user.setLastName(request.lastName());
		user.setPhone(request.phone());

		Optional.ofNullable(request.address()).ifPresent(address -> {
			Address addr = Optional.ofNullable(user.getAddress()).orElse(new Address());
			Optional.ofNullable(address.street()).ifPresent(street -> {
				addr.setStreet(street);
			});
			Optional.ofNullable(address.pinCode()).ifPresent(pinCode -> {
				addr.setPinCode(pinCode);
			});
			Optional.ofNullable(address.state()).ifPresent(state -> {
				addr.setState(state);
			});
			Optional.ofNullable(address.country()).ifPresent(country -> {
				addr.setCountry(country);
			});
			user.setAddress(addr);
		});

		user.setDob(Optional.ofNullable(request.dob()).orElse(user.getDob()));
		user.setGender(request.gender());
		user.setEnabled(Optional.ofNullable(request.enabled()).orElse(user.isEnabled()));

		return mapToResponse(userRepository.save(user));
	}

	@Override
	public UserResponse changePassword(PasswordChangeRequestDto request) {

		AuthenticatedUser currentUser = authenticationContext.getCurrentUser().orElse(null);

		User user = userRepository.findById(UUID.fromString(currentUser.getUserId()))
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!passwordEncoder.matches(request.oldPassword(), user.getPassword()))
			throw new ForbiddenException("Incorrect old password.");

		user.setPassword(passwordEncoder.encode(request.newPassword()));

		return mapToResponse(userRepository.save(user));
	}

	@Override
	@Transactional
	public void deleteUser(UUID id) {

		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setDeleted(true);

		if (user.getAddress() != null) {
			user.getAddress().setDeleted(true);
		}

		userRepository.save(user);
	}

	private UserResponse mapToResponse(User user) {

		return UserResponse.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.phone(user.getPhone())
				.gender(user.getGender())
				.address(user.getAddress())
				.dob(user.getDob())
				.enabled(user.isEnabled())
				.roles(
						user.getRoles().stream()
								.map(role -> role.getName())
								.collect(Collectors.toSet()))
				.createdAt(user.getCreatedAt())
				.updatedAt(user.getUpdatedAt())
				.build();
	}

	private UserResponse mapToResponse(User user, boolean ignoreTimeStamps) {

		return UserResponse.builder()
				.id(user.getId())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.phone(user.getPhone())
				.gender(user.getGender())
				.address(user.getAddress())
				.dob(user.getDob())
				.enabled(user.isEnabled())
				.roles(
						user.getRoles().stream()
								.map(role -> role.getName())
								.collect(Collectors.toSet()))
				.build();
	}
}