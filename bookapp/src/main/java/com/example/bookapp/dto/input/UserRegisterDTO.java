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

    @NotBlank(message = "Username cannot be blank or null")
    @Size(min = 2, max = 50, message = "Username must be between 2 and 50 characters long")
    private String username;

    @NotBlank(message = "Email cannot be blank or null")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank or null")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).{6,}$",
            message = "Password must be at least 6 characters long and contain at least one letter and one number"
    )
    private String password;
}
