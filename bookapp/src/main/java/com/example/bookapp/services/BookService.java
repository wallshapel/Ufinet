package com.example.bookapp.services;

import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.input.BookUpdateDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import org.springframework.data.domain.Page;

public interface BookService {

    BookResponseDTO register(BookRegisterDTO dto);

    BookResponseDTO update(BookUpdateDTO dto);

    void deleteByIsbn(String isbn, Long userId);

    Page<BookResponseDTO> findPaginated(Long userId, int page, int size);

    Page<BookResponseDTO> findByGenreIdAndUserId(Long genreId, Long userId, int page, int size);

    BookResponseDTO findByIsbnAndUserId(String isbn, Long userId);
}
