package com.example.bookapp.services;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.UserRegisterDTO;
import com.example.bookapp.dto.output.UserResponseDTO;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.impl.UserServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Mapper mapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRegisterDTO dto;
    private User userEntity;
    private User savedUser;
    private UserResponseDTO expectedResponse;

    @BeforeEach
    void setUp() {
        dto = new UserRegisterDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("plaintext");

        userEntity = new User();
        userEntity.setEmail(dto.getEmail());

        savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(dto.getEmail());

        expectedResponse = new UserResponseDTO();
        expectedResponse.setId(1L);
        expectedResponse.setUsername(dto.getUsername());
    }

    @Test
    void register_shouldCreateUserSuccessfully() {
        // Arrange
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        when(mapper.toEntity(dto, User.class)).thenReturn(userEntity);
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(mapper.toDto(savedUser, UserResponseDTO.class)).thenReturn(expectedResponse);

        // Act
        UserResponseDTO result = userService.register(dto);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getUsername(), result.getUsername());

        verify(userRepository).existsByEmail(dto.getEmail());
        verify(passwordEncoder).encode(dto.getPassword());
        verify(userRepository).save(any(User.class));
        verify(mapper).toDto(savedUser, UserResponseDTO.class);
    }

    @Test
    void register_shouldThrowExceptionWhenEmailExists() {
        // Arrange
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(true);

        // Act & Assert
        AlreadyExistException thrown = assertThrows(
                AlreadyExistException.class,
                () -> userService.register(dto)
        );

        assertEquals("email already exists", thrown.getMessage());
        verify(userRepository).existsByEmail(dto.getEmail());
        verifyNoMoreInteractions(userRepository, passwordEncoder, mapper);
    }
}