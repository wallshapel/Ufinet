package com.example.bookapp.dto.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRegisterDTO {

    @NotBlank(message = "isbn cannot be null or empty")
    @Size(min = 10, max = 13, message = "isbn must be between 10 and 13 characters")
    private String isbn;

    @NotBlank(message = "title cannot be null or empty")
    @Size(min = 2, max = 100, message = "title must be between 2 and 100 characters")
    private String title;

    @NotBlank(message = "genre cannot be null or empty")
    @Size(min = 3, max = 30, message = "genre must be between 3 and 30 characters")
    private String genre;

    @NotBlank(message = "publishedDate cannot be null or empty")
    private String publishedDate;

    @NotBlank(message = "synopsis cannot be null or empty")
    @Size(min = 10, max = 500, message = "synopsis must be between 10 and 500 characters")
    private String synopsis;

    private Long userId;
}
