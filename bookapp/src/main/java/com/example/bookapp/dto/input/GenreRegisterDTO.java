package com.example.bookapp.dto.input;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreRegisterDTO {

    @NotBlank(message = "El nombre del género no puede estar vacío")
    @Size(min = 3, max = 30, message = "El nombre del género debe tener entre 3 y 30 caracteres")
    private String name;

    @Min(value = 1, message = "El ID del usuario debe ser mayor o igual a 1")
    private Long userId;
}
