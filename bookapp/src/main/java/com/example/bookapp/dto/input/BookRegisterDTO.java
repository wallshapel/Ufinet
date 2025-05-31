package com.example.bookapp.dto.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRegisterDTO {

    @NotBlank(message = "El ISBN no puede estar vacío ni ser nulo")
    @Size(min = 10, max = 13, message = "El ISBN debe tener entre 10 y 13 caracteres")
    private String isbn;

    @NotBlank(message = "El título no puede estar vacío ni ser nulo")
    @Size(min = 2, max = 100, message = "El título debe tener entre 2 y 100 caracteres")
    private String title;

    @NotBlank(message = "El género no puede estar vacío ni ser nulo")
    @Size(min = 3, max = 30, message = "El género debe tener entre 3 y 30 caracteres")
    private String genre;

    @NotBlank(message = "El año de publicación no puede estar vacío ni ser nulo")
    private String publishedDate;

    @NotBlank(message = "la sinopsis no puede estar vacío ni ser nulo")
    @Size(min = 10, max = 500, message = "La sinopsis debe tener entre 10 y 500 caracteres")
    private String synopsis;

    private Long userId;
}
