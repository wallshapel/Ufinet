package com.example.bookapp.controllers;

import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.input.BookUpdateDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import com.example.bookapp.services.BookService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

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

    @PatchMapping
    public ResponseEntity<BookResponseDTO> update(@Validated @RequestBody BookUpdateDTO dto) {
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

    @GetMapping("/user/{userId}/genre/{genreId}")
    public ResponseEntity<Page<BookResponseDTO>> findByGenreAndUser(
            @PathVariable @Min(1) Long genreId,
            @PathVariable @Min(1) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<BookResponseDTO> result = bookService.findByGenreIdAndUserId(genreId, userId, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<BookResponseDTO> getBookByIsbnAndUserId(
            @PathVariable String isbn,
            @RequestParam Long userId
    ) {
        BookResponseDTO response = bookService.findByIsbnAndUserId(isbn, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{isbn}/cover")
    public ResponseEntity<BookResponseDTO> updateCoverImage(
            @PathVariable String isbn,
            @RequestParam Long userId,
            @RequestParam("file") MultipartFile file
    ) {
        BookResponseDTO updated = bookService.updateCoverImage(isbn, userId, file);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/cover")
    public ResponseEntity<Resource> getCoverImage(
            @RequestParam Long userId,
            @RequestParam String path
    ) {
        Resource image = bookService.getCoverImageForUser(userId, path);

        try {
            String contentType = Files.probeContentType(Path.of(image.getFile().getAbsolutePath()));
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFilename() + "\"")
                    .body(image);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
