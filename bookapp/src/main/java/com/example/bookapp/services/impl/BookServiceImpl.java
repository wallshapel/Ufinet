package com.example.bookapp.services.impl;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import com.example.bookapp.entities.Book;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.exceptions.ResourceNotFoundException;
import com.example.bookapp.repositories.BookRepository;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;

    @Override
    public BookResponseDTO register(BookRegisterDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("user not found"));

        if (bookRepository.existsByIsbnAndUserId(dto.getIsbn(), user.getId())) {
            throw new AlreadyExistException("isbn already exists for this user");
        }

        Book book = mapper.toEntity(dto, Book.class);
        book.setUser(user);
        Book savedBook = bookRepository.save(book);
        return mapper.toDto(savedBook, BookResponseDTO.class);
    }

    @Override
    public BookResponseDTO update(BookRegisterDTO dto) {
        Book book = bookRepository.findByIsbnAndUserId(dto.getIsbn(), dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("book not found"));

        book.setTitle(dto.getTitle());
        book.setGenre(dto.getGenre());
        book.setPublishedDate(dto.getPublishedDate());
        book.setSynopsis(dto.getSynopsis());

        Book updatedBook = bookRepository.save(book);
        return mapper.toDto(updatedBook, BookResponseDTO.class);
    }

    @Override
    public void deleteByIsbn(String isbn, Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("user not found");
        }

        Book book = bookRepository.findByIsbnAndUserId(isbn, userId)
                .orElseThrow(() -> new ResourceNotFoundException("book not found"));

        bookRepository.delete(book);
    }

    @Override
    public Page<BookResponseDTO> findPaginated(Long userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("user not found");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Book> booksPage = bookRepository.findByUserId(userId, pageable);
        return booksPage.map(book -> mapper.toDto(book, BookResponseDTO.class));
    }

    @Override
    public Page<BookResponseDTO> findByGenreAndUserId(String genre, Long userId, int page, int size) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("user not found");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Book> booksPage = bookRepository.findByGenreIgnoreCaseAndUserId(genre, userId, pageable);

        if (booksPage.isEmpty()) {
            throw new ResourceNotFoundException("no books found for genre: " + genre);
        }

        return booksPage.map(book -> mapper.toDto(book, BookResponseDTO.class));
    }

    @Override
    public BookResponseDTO findByIsbnAndUserId(String isbn, Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("user not found");
        }

        Book book = bookRepository.findByIsbnAndUserId(isbn, userId)
                .orElseThrow(() -> new ResourceNotFoundException("book not found"));

        return mapper.toDto(book, BookResponseDTO.class);
    }
}
