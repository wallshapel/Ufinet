package com.example.bookapp.services;

import com.example.bookapp.dto.input.BookRegisterDTO;
import com.example.bookapp.dto.input.BookUpdateDTO;
import com.example.bookapp.dto.output.BookResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface BookService {

    BookResponseDTO register(BookRegisterDTO dto);

    BookResponseDTO update(BookUpdateDTO dto);

    void deleteByIsbn(String isbn, Long userId);

    Page<BookResponseDTO> findPaginated(Long userId, int page, int size);

    Page<BookResponseDTO> findByGenreIdAndUserId(Long genreId, Long userId, int page, int size);

    BookResponseDTO findByIsbnAndUserId(String isbn, Long userId);

    void updateCoverImage(String isbn, Long userId, MultipartFile file);

    Resource getCoverImageForUser(Long userId, String path);
}
