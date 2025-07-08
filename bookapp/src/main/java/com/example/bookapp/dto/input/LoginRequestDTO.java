package com.example.bookapp.dto.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {

    @NotBlank(message = "Email cannot be blank or null")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password cannot be blank or null")
    private String password;
}
