package com.example.bookapp.dto.input;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookUpdateDTO {

    @NotNull(message = "El ISBN es obligatorio")
    @NotBlank(message = "El ISBN no puede estar vacío")
    @Size(min = 10, max = 13, message = "El ISBN debe tener entre 10 y 13 caracteres")
    private String isbn;

    @Size(min = 2, max = 100, message = "El título debe tener entre 2 y 100 caracteres")
    private String title;

    @Min(value = 1, message = "El ID del género debe ser mayor o igual a 1")
    private Long genreId;

    @PastOrPresent(message = "La fecha de publicación no puede ser en el futuro")
    private LocalDate publishedDate;

    @Size(min = 10, max = 500, message = "La sinopsis debe tener entre 10 y 500 caracteres")
    private String synopsis;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Min(value = 1, message = "El ID del usuario debe ser mayor o igual a 1")
    private Long userId;
}
