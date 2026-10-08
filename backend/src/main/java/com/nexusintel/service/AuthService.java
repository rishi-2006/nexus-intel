package com.nexusintel.service;

import com.nexusintel.dto.AuthResponse;
import com.nexusintel.dto.LoginRequest;
import com.nexusintel.dto.RegisterRequest;
import com.nexusintel.dto.UserDTO;
import com.nexusintel.entity.User;
import com.nexusintel.entity.UserProfile;
import com.nexusintel.exception.BadRequestException;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.exception.ResourceNotFoundException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.UserRepository;
import com.nexusintel.security.CustomUserDetails;
import com.nexusintel.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper entityMapper;

    // Unit 2 requirement: Constructor dependency injection
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       EntityMapper entityMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.entityMapper = entityMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User();
        user.setName(request.getFullName().trim());
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        // Unit 4: OneToOne profile creation
        UserProfile profile = new UserProfile();
        profile.setBadgeNumber("NX-" + (1000 + (int)(Math.random() * 9000)));
        profile.setDepartment("Intelligence Analysis Division");
        profile.setClearanceLevel(request.getRole().name() + "_TIER_1");
        user.setUserProfile(profile);

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", savedUser.getRole().name());
        extraClaims.put("name", savedUser.getName());
        extraClaims.put("userId", savedUser.getId());

        String jwt = jwtService.generateToken(userDetails, extraClaims);
        UserDTO userDTO = entityMapper.toUserDTO(savedUser);

        return new AuthResponse(jwt, userDTO);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("name", user.getName());
        extraClaims.put("userId", user.getId());

        String jwt = jwtService.generateToken(userDetails, extraClaims);
        UserDTO userDTO = entityMapper.toUserDTO(user);

        return new AuthResponse(jwt, userDTO);
    }

    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return entityMapper.toUserDTO(user);
    }
}
