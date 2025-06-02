package com.example.bookapp.dto.output;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookResponseDTO {

    private String isbn;
    private String title;
    private String genre;
    private LocalDate publishedDate;
    private String synopsis;
}
