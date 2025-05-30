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
    @NotBlank(message = "username cannot be null or empty")
    @Size(min = 2, max = 50, message = "username must be between 2 and 50 characters")
    private String username;

    @NotBlank(message = "email cannot be null or empty")
    @Email(message = "email must be valid")
    private String email;

    @NotBlank(message = "password cannot be null or empty")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).{6,}$",
            message = "password must be at least 6 characters and contain at least one letter and one number"
    )
    private String password;
}
