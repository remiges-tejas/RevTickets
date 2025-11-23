package com.revtickets.service;

import com.revtickets.dto.request.LoginRequest;
import com.revtickets.dto.request.RegisterRequest;
import com.revtickets.dto.response.AuthResponse;
import com.revtickets.dto.response.UserResponse;
import com.revtickets.entity.mysql.Role;
import com.revtickets.entity.mysql.User;
import com.revtickets.exception.BadRequestException;
import com.revtickets.exception.ResourceNotFoundException;
import com.revtickets.repository.mysql.RoleRepository;
import com.revtickets.repository.mysql.UserRepository;
import com.revtickets.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService activityLogService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }

        // Get default customer role
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_CUSTOMER"));

        Set<Role> roles = new HashSet<>();
        roles.add(customerRole);

        // Create new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Log activity
        activityLogService.logUserRegistration(user);

        // Generate token
        String token = tokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public AuthResponse login(LoginRequest request) {

        String identifier = request.getEmailOrPhone();  // <- FIX


        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    identifier,
                    request.getPassword()
            )
    );

        String token = tokenProvider.generateToken(authentication);
        System.out.println("Generated Token: " + token);

        User user = userRepository.findByEmailOrPhone(identifier)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email/phone", identifier));
        System.out.println("Authenticated User: " + user.getEmail());

        activityLogService.logUserLogin(user);

    return new AuthResponse(token, UserResponse.fromEntity(user));
    }
}
