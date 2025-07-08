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
import com.example.bookapp.services.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private static final String BOOK_NOT_FOUND_FOR_USER = "Book not found for the user";

    private final BookRepository bookRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;
    private final ImageStorageService imageStorageService;

    @Override
    @Transactional
    public BookResponseDTO register(BookRegisterDTO dto) {
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new AlreadyExistException("A book with this ISBN already exists");
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
                .orElseThrow(() -> new ResourceNotFoundException(BOOK_NOT_FOUND_FOR_USER));

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
                .orElseThrow(() -> new ResourceNotFoundException(BOOK_NOT_FOUND_FOR_USER));

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
                .orElseThrow(() -> new ResourceNotFoundException(BOOK_NOT_FOUND_FOR_USER));
        return toBookResponseDTO(book);
    }

    @Override
    @Transactional
    public BookResponseDTO updateCoverImage(String isbn, Long userId, MultipartFile file) {
        Book book = bookRepository.findByIsbnAndUserId(isbn, userId)
                .orElseThrow(() -> new ResourceNotFoundException(BOOK_NOT_FOUND_FOR_USER));

        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");

        String contentType = file.getContentType();
        if (contentType == null || !contentType.matches("image/(jpeg|png|jpg)")) {
            throw new IllegalArgumentException("Only JPG or PNG images are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Maximum allowed file size is 5MB");
        }

        String imagePath = imageStorageService.storeCoverImage(file, isbn);
        book.setCoverImagePath(imagePath);
        Book saved = bookRepository.save(book);

        return toBookResponseDTO(saved);
    }

    @Override
    @Transactional
    public Resource getCoverImageForUser(Long userId, String path) {
        String normalizedPath = Paths.get(path).normalize().toString();

        String[] parts = normalizedPath.split("/");
        if (parts.length < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid cover image path");
        }

        Path imagePath = Paths.get("uploads", "books", normalizedPath);
        if (!Files.exists(imagePath) || !Files.isReadable(imagePath)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
        }

        try {
            return new UrlResource(imagePath.toUri());
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error accessing the image");
        }
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Genre getGenreOrThrow(Long genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new ResourceNotFoundException("Genre not found"));
    }

    private BookResponseDTO toBookResponseDTO(Book book) {
        BookResponseDTO dto = mapper.toDto(book, BookResponseDTO.class);
        dto.setGenre(book.getGenre().getName());
        return dto;
    }
}
