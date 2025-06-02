package com.example.bookapp.services.impl;

import com.example.bookapp.components.Mapper;
import com.example.bookapp.dto.input.GenreRegisterDTO;
import com.example.bookapp.dto.output.GenreResponseDTO;
import com.example.bookapp.entities.Genre;
import com.example.bookapp.entities.User;
import com.example.bookapp.exceptions.AlreadyExistException;
import com.example.bookapp.exceptions.ResourceNotFoundException;
import com.example.bookapp.repositories.GenreRepository;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.services.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;

    @Override
    @Transactional
    public GenreResponseDTO register(GenreRegisterDTO dto) {
        User user = getUserOrThrow(dto.getUserId());
        validateUniqueGenreName(dto.getName(), dto.getUserId());

        Genre genre = Genre.builder()
                .name(dto.getName())
                .user(user)
                .build();

        Genre saved = genreRepository.save(genre);
        return mapper.toDto(saved, GenreResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreResponseDTO> findAllByUserId(Long userId) {
        List<Genre> genres = genreRepository.findByUserId(userId);
        return genres.stream()
                .map(genre -> mapper.toDto(genre, GenreResponseDTO.class))
                .collect(Collectors.toList());
    }


    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private void validateUniqueGenreName(String name, Long userId) {
        if (genreRepository.existsByNameIgnoreCaseAndUserId(name, userId)) {
            throw new AlreadyExistException("Ya existe un género con ese nombre para este usuario");
        }
    }
}
