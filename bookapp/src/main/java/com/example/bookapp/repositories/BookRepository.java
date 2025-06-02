package com.example.bookapp.repositories;

import com.example.bookapp.entities.Book;
import com.example.bookapp.entities.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    Optional<Book> findByIsbnAndUserId(String isbn, Long userId);

    boolean existsByIsbn(String isbn);

    Page<Book> findByUserId(Long userId, Pageable pageable);

    Page<Book> findByGenreAndUserId(Genre genre, Long userId, Pageable pageable);

    long countByGenreId(Long genreId);
}
