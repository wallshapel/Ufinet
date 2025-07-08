package com.example.bookapp.services;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.GenreRegisterDTO;
import com.example.bookapp.dto.output.GenreResponseDTO;
import com.example.bookapp.entities.Genre;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.exceptions.ResourceNotFoundException;
import com.example.bookapp.repositories.GenreRepository;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.impl.GenreServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GenreServiceImplTest {

    @Mock
    private GenreRepository genreRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Mapper mapper;

    @InjectMocks
    private GenreServiceImpl genreService;

    private GenreRegisterDTO dto;
    private User user;
    private Genre savedGenre;
    private GenreResponseDTO expectedResponse;

    @BeforeEach
    void setUp() {
        dto = new GenreRegisterDTO();
        dto.setName("Fantasía");
        dto.setUserId(1L);

        user = new User();
        user.setId(1L);
        user.setUsername("legato");



        savedGenre = Genre.builder()
                .id(100L)
                .name(dto.getName())
                .user(user)
                .build();

        expectedResponse = new GenreResponseDTO();
        expectedResponse.setId(100L);
        expectedResponse.setName(dto.getName());
    }

    @Test
    void register_shouldCreateGenreSuccessfully() {
        // Arrange
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(genreRepository.existsByNameIgnoreCaseAndUserId(dto.getName(), dto.getUserId())).thenReturn(false);
        when(genreRepository.save(any(Genre.class))).thenReturn(savedGenre);
        when(mapper.toDto(savedGenre, GenreResponseDTO.class)).thenReturn(expectedResponse);

        // Act
        GenreResponseDTO result = genreService.register(dto);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse.getId(), result.getId());
        assertEquals(expectedResponse.getName(), result.getName());

        verify(userRepository).findById(dto.getUserId());
        verify(genreRepository).existsByNameIgnoreCaseAndUserId(dto.getName(), dto.getUserId());
        verify(genreRepository).save(any(Genre.class));
        verify(mapper).toDto(savedGenre, GenreResponseDTO.class);
    }

    @Test
    void register_shouldThrowIfUserNotFound() {
        // Arrange
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () ->
                genreService.register(dto)
        );

        assertEquals("User not found", ex.getMessage());
        verify(userRepository).findById(dto.getUserId());
        verifyNoMoreInteractions(genreRepository, mapper);
    }

    @Test
    void register_shouldThrowIfGenreAlreadyExists() {
        // Arrange
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(genreRepository.existsByNameIgnoreCaseAndUserId(dto.getName(), dto.getUserId())).thenReturn(true);

        // Act & Assert
        AlreadyExistException ex = assertThrows(AlreadyExistException.class, () ->
                genreService.register(dto)
        );

        assertEquals("A genre with this name already exists for this user", ex.getMessage());
        verify(userRepository).findById(dto.getUserId());
        verify(genreRepository).existsByNameIgnoreCaseAndUserId(dto.getName(), dto.getUserId());
        verifyNoMoreInteractions(genreRepository, mapper);
    }
}
