package com.example.bookapp.dto.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {

    @NotBlank(message = "email cannot be null or empty")
    @Email(message = "email must be valid")
    private String email;

    @NotBlank(message = "password cannot be null or empty")
    private String password;
}
