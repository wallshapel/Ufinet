package com.example.bookapp.dto.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDTO {
    @NotBlank(message = "El nombre de usuario no puede estar vacío ni ser nulo")
    @Size(min = 2, max = 50, message = "El nombre de usuario debe tener entre 2 y 50 caracteres")
    private String username;

    @NotBlank(message = "El email no puede estar vacío ni ser nulo")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacío ni ser nula")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).{6,}$",
            message = "La contraseña debe tener al menos 6 caracteres y contener al menos una letra y un número"
    )
    private String password;
}
