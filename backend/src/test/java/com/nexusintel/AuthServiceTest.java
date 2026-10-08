package com.nexusintel;

import com.nexusintel.dto.AuthResponse;
import com.nexusintel.dto.LoginRequest;
import com.nexusintel.dto.RegisterRequest;
import com.nexusintel.dto.UserDTO;
import com.nexusintel.entity.Role;
import com.nexusintel.entity.User;
import com.nexusintel.exception.BadRequestException;
import com.nexusintel.exception.DuplicateResourceException;
import com.nexusintel.mapper.EntityMapper;
import com.nexusintel.repository.UserRepository;
import com.nexusintel.security.JwtService;
import com.nexusintel.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private EntityMapper entityMapper;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager, entityMapper);
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest("Test Analyst", "test@nexus.local", "Password123!", "Password123!", Role.ANALYST);
        when(userRepository.existsByEmail("test@nexus.local")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encoded_pass");

        User savedUser = new User(1L, "Test Analyst", "test@nexus.local", "encoded_pass", Role.ANALYST);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(), any())).thenReturn("mock.jwt.token");
        when(entityMapper.toUserDTO(savedUser)).thenReturn(new UserDTO(1L, "Test Analyst", "test@nexus.local", Role.ANALYST, "NX-100", "Intelligence", "TIER_1", "123", null));

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals("Test Analyst", res.getUser().getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest req = new RegisterRequest("Duplicate User", "admin@nexus.local", "Password123!", "Password123!", Role.ADMIN);
        when(userRepository.existsByEmail("admin@nexus.local")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_MismatchedPasswords_ThrowsBadRequest() {
        RegisterRequest req = new RegisterRequest("User", "test@nexus.local", "Password123!", "DifferentPass!", Role.INVESTIGATOR);
        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("investigator@nexus.local", "Password123!");
        User user = new User(2L, "Investigator Vance", "investigator@nexus.local", "hash", Role.INVESTIGATOR);
        when(userRepository.findByEmail("investigator@nexus.local")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(), any())).thenReturn("mock.login.jwt");
        when(entityMapper.toUserDTO(user)).thenReturn(new UserDTO(2L, "Investigator Vance", "investigator@nexus.local", Role.INVESTIGATOR, "NX-102", "Crime", "SECRET", "456", null));

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock.login.jwt", res.getToken());
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void login_InvalidPassword_ThrowsAuthenticationException() {
        LoginRequest req = new LoginRequest("investigator@nexus.local", "WrongPassword");
        doThrow(new BadCredentialsException("Bad credentials")).when(authenticationManager).authenticate(any());

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }
}
