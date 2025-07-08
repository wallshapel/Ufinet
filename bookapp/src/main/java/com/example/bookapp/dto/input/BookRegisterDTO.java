package com.example.bookapp.dto.input;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookRegisterDTO {

    @NotNull(message = "ISBN is required")
    @NotBlank(message = "ISBN cannot be blank")
    @Size(min = 10, max = 13, message = "ISBN must be between 10 and 13 characters long")
    private String isbn;

    @NotNull(message = "Title is required")
    @NotBlank(message = "Title cannot be blank")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters long")
    private String title;

    @NotNull(message = "Genre ID is required")
    @Min(value = 1, message = "Genre ID must be greater than or equal to 1")
    private Long genreId;

    @NotNull(message = "Published date is required")
    @PastOrPresent(message = "Published date cannot be in the future")
    private LocalDate publishedDate;

    @NotNull(message = "Synopsis is required")
    @NotBlank(message = "Synopsis cannot be blank or null")
    @Size(min = 10, max = 500, message = "Synopsis must be between 10 and 500 characters long")
    private String synopsis;

    @NotNull(message = "User ID is required")
    @Min(value = 1, message = "User ID must be greater than or equal to 1")
    private Long userId;
}
