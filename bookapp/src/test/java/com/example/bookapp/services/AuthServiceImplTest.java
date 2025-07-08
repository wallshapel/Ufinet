package com.example.bookapp.services;

import com.example.bookapp.dto.input.LoginRequestDTO;
import com.example.bookapp.dto.output.LoginResponseDTO;
import com.example.bookapp.entities.User;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.security.jwt.JwtService;
import com.example.bookapp.services.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private UserDetailsService userDetailsService;
    private UserRepository userRepository;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authenticationManager = mock(AuthenticationManager.class);
        jwtService = mock(JwtService.class);
        userDetailsService = mock(UserDetailsService.class);
        userRepository = mock(UserRepository.class);

        authService = new AuthServiceImpl(authenticationManager, jwtService, userDetailsService, userRepository);
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() {
        // Arrange
        String email = "abel@example.com";
        String password = "123456";
        String expectedToken = "jwt.token.aqui";

        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail(email);
        request.setPassword(password);

        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setUsername("abel");

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtService.generateToken(anyMap(), eq(userDetails))).thenReturn(expectedToken);

        // Act
        LoginResponseDTO result = authService.login(request);

        // Assert
        assertNotNull(result);
        assertEquals(expectedToken, result.getToken());

        // Verify interactions
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail(email);
        verify(userDetailsService).loadUserByUsername(email);
        verify(jwtService).generateToken(anyMap(), eq(userDetails));
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("notfound@example.com");
        request.setPassword("secret");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("User not found", exception.getMessage());

        verify(authenticationManager).authenticate(any());
        verify(userRepository).findByEmail(request.getEmail());
        verifyNoInteractions(jwtService);
        verifyNoInteractions(userDetailsService);
    }
}
