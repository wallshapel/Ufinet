package com.example.bookapp.services.impl;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.input.BookUpdateDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import com.example.bookapp.entities.Book;
import com.example.bookapp.entities.Genre;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.exceptions.ResourceNotFoundException;
import com.example.bookapp.repositories.BookRepository;
import com.example.bookapp.repositories.GenreRepository;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;

    @Override
    @Transactional
    public BookResponseDTO register(BookRegisterDTO dto) {
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new AlreadyExistException("Ya existe un libro con ese ISBN");
        }

        Genre genre = getGenreOrThrow(dto.getGenreId());
        User user = getUserOrThrow(dto.getUserId());

        Book book = mapper.toEntity(dto, Book.class);
        book.setUser(user);
        book.setGenre(genre);

        Book saved = bookRepository.save(book);
        return toBookResponseDTO(saved);
    }

    @Override
    @Transactional
    public BookResponseDTO update(BookUpdateDTO dto) {
        Book book = bookRepository.findByIsbnAndUserId(dto.getIsbn(), dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado para el usuario"));

        if (dto.getTitle() != null) book.setTitle(dto.getTitle());
        if (dto.getPublishedDate() != null) book.setPublishedDate(dto.getPublishedDate());
        if (dto.getSynopsis() != null) book.setSynopsis(dto.getSynopsis());

        if (dto.getGenreId() != null) {
            Genre genre = getGenreOrThrow(dto.getGenreId());
            book.setGenre(genre);
        }

        Book updated = bookRepository.save(book);
        return toBookResponseDTO(updated);
    }

    @Override
    @Transactional
    public void deleteByIsbn(String isbn, Long userId) {
        getUserOrThrow(userId);
        Book book = bookRepository.findByIsbnAndUserId(isbn, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado para el usuario"));

        bookRepository.delete(book);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookResponseDTO> findPaginated(Long userId, int page, int size) {
        Page<Book> books = bookRepository.findByUserId(userId, PageRequest.of(page, size));
        return books.map(this::toBookResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookResponseDTO> findByGenreIdAndUserId(Long genreId, Long userId, int page, int size) {
        getUserOrThrow(userId);
        Genre genre = getGenreOrThrow(genreId);
        Page<Book> books = bookRepository.findByGenreAndUserId(genre, userId, PageRequest.of(page, size));
        return books.map(this::toBookResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public BookResponseDTO findByIsbnAndUserId(String isbn, Long userId) {
        getUserOrThrow(userId);
        Book book = bookRepository.findByIsbnAndUserId(isbn, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Libro no encontrado para el usuario"));
        return toBookResponseDTO(book);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private Genre getGenreOrThrow(Long genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("Género no encontrado"));
    }

    private BookResponseDTO toBookResponseDTO(Book book) {
        BookResponseDTO dto = mapper.toDto(book, BookResponseDTO.class);
        dto.setGenre(book.getGenre().getName());
        return dto;
    }
}
