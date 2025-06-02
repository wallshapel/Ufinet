package com.example.bookapp.repositories;

import com.example.bookapp.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    Optional<Genre> findByNameIgnoreCaseAndUserId(String name, Long userId);

    boolean existsByNameIgnoreCaseAndUserId(String name, Long userId);

    List<Genre> findByUserId(Long userId);

    boolean existsByIdAndBooksIsNotEmpty(Long genreId);
}