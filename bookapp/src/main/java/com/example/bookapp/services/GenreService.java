package com.example.bookapp.services;

import com.example.bookapp.dto.input.GenreRegisterDTO;
import com.example.bookapp.dto.output.GenreResponseDTO;

import java.util.List;

public interface GenreService {

    GenreResponseDTO register(GenreRegisterDTO dto);

    List<GenreResponseDTO> findAllByUserId(Long userId);
}
