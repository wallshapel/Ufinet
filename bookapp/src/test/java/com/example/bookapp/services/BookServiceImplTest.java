package com.example.bookapp.services;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import com.example.bookapp.entities.Book;
import com.example.bookapp.entities.Genre;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.repositories.BookRepository;
import com.example.bookapp.repositories.GenreRepository;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookServiceImplTest {

    private BookRepository bookRepository;
    private GenreRepository genreRepository;
    private UserRepository userRepository;
    private Mapper mapper;
    private ImageStorageService imageStorageService;

    private BookServiceImpl bookService;

    @BeforeEach
    void setUp() {
        bookRepository = mock(BookRepository.class);
        genreRepository = mock(GenreRepository.class);
        userRepository = mock(UserRepository.class);
        mapper = mock(Mapper.class);
        imageStorageService = mock(ImageStorageService.class);

        bookService = new BookServiceImpl(bookRepository, genreRepository, userRepository, mapper, imageStorageService);
    }

    @Test
    void register_ShouldSaveBookAndReturnDTO_WhenValidInput() {
        // Arrange
        BookRegisterDTO dto = new BookRegisterDTO();
        dto.setIsbn("1234567890");
        dto.setTitle("Clean Code");
        dto.setGenreId(1L);
        dto.setUserId(2L);
        dto.setPublishedDate(LocalDate.of(2020, 1, 1));
        dto.setSynopsis("A book about clean code");

        Genre genre = new Genre();
        genre.setId(1L);
        genre.setName("Programming");

        User user = new User();
        user.setId(2L);
        user.setUsername("abel");

        Book book = new Book();
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setGenre(genre);
        book.setUser(user);
        book.setPublishedDate(dto.getPublishedDate());
        book.setSynopsis(dto.getSynopsis());

        Book savedBook = new Book();
        savedBook.setIsbn(book.getIsbn());
        savedBook.setTitle(book.getTitle());
        savedBook.setGenre(book.getGenre());
        savedBook.setUser(book.getUser());
        savedBook.setPublishedDate(book.getPublishedDate());
        savedBook.setSynopsis(book.getSynopsis());

        BookResponseDTO responseDTO = new BookResponseDTO();
        responseDTO.setIsbn(dto.getIsbn());
        responseDTO.setTitle(dto.getTitle());
        responseDTO.setGenre(genre.getName());
        responseDTO.setPublishedDate(dto.getPublishedDate());
        responseDTO.setSynopsis(dto.getSynopsis());

        when(bookRepository.existsByIsbn(dto.getIsbn())).thenReturn(false);
        when(genreRepository.findById(dto.getGenreId())).thenReturn(Optional.of(genre));
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(mapper.toEntity(dto, Book.class)).thenReturn(book);
        when(bookRepository.save(book)).thenReturn(savedBook);
        when(mapper.toDto(savedBook, BookResponseDTO.class)).thenReturn(responseDTO);

        // Act
        BookResponseDTO result = bookService.register(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.getIsbn(), result.getIsbn());
        assertEquals(dto.getTitle(), result.getTitle());
        assertEquals("Programming", result.getGenre());
        verify(bookRepository).save(book);
    }

    @Test
    void register_ShouldThrowAlreadyExistException_WhenIsbnExists() {
        // Arrange
        BookRegisterDTO dto = new BookRegisterDTO();
        dto.setIsbn("1234567890");

        when(bookRepository.existsByIsbn(dto.getIsbn())).thenReturn(true);

        // Act & Assert
        assertThrows(AlreadyExistException.class, () -> bookService.register(dto));
        verify(bookRepository, never()).save(any());
    }
}
