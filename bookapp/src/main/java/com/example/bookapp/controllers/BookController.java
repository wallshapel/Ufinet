package com.example.bookapp.controllers;

import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import com.example.bookapp.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookResponseDTO> register(@Valid @RequestBody BookRegisterDTO dto) {
        BookResponseDTO response = bookService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<BookResponseDTO> update(@Valid @RequestBody BookRegisterDTO dto) {
        BookResponseDTO response = bookService.update(dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{isbn}")
    public ResponseEntity<Void> delete(@PathVariable String isbn, @RequestParam Long userId) {
        bookService.deleteByIsbn(isbn, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<BookResponseDTO>> getBooksByUser(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<BookResponseDTO> response = bookService.findPaginated(userId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/genre")
    public ResponseEntity<Page<BookResponseDTO>> getBooksByGenre(
            @RequestParam String genre,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<BookResponseDTO> response = bookService.findByGenreAndUserId(genre, userId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<BookResponseDTO> getBookByIsbnAndUserId(
            @PathVariable String isbn,
            @RequestParam Long userId
    ) {
        BookResponseDTO response = bookService.findByIsbnAndUserId(isbn, userId);
        return ResponseEntity.ok(response);
    }
}
