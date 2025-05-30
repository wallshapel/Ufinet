package com.example.bookapp.repositories;

import com.example.bookapp.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findByUserId(Long userId);
    List<Book> findByGenreIgnoreCaseAndUserId(String genre, Long userId);
    Optional<Book> findByIsbnAndUserId(String isbn, Long userId);
    boolean existsByIsbnAndUserId(String isbn, Long userId);
    Page<Book> findByUserId(Long userId, Pageable pageable);
    Page<Book> findByGenreIgnoreCaseAndUserId(String genre, Long userId, Pageable pageable);
}
