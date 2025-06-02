package com.example.bookapp.controllers;

import com.example.bookapp.dto.input.GenreRegisterDTO;
import com.example.bookapp.dto.output.GenreResponseDTO;
import com.example.bookapp.services.GenreService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/genres")
@RequiredArgsConstructor
@Validated
public class GenreController {

    private final GenreService genreService;

    @PostMapping
    public ResponseEntity<GenreResponseDTO> register(@Valid @RequestBody GenreRegisterDTO dto) {
        GenreResponseDTO response = genreService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GenreResponseDTO>> findAllByUser(@PathVariable @Min(1) Long userId) {
        List<GenreResponseDTO> genres = genreService.findAllByUserId(userId);
        return ResponseEntity.ok(genres);
    }
}

