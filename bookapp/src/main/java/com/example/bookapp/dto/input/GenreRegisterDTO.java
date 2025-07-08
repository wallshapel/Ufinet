package com.example.bookapp.dto.input;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreRegisterDTO {

    @NotBlank(message = "Genre name cannot be blank")
    @Size(min = 3, max = 30, message = "Genre name must be between 3 and 30 characters long")
    private String name;

    @Min(value = 1, message = "User ID must be greater than or equal to 1")
    private Long userId;
}
