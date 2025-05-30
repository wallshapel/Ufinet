package com.example.bookapp.dto.output;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookResponseDTO {

    private String isbn;
    private String title;
    private String genre;
    private String publishedDate;
    private String synopsis;
}
