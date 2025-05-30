package com.example.bookapp.services;

import com.example.bookapp.dto.input.LoginRequestDTO;
import com.example.bookapp.dto.output.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO request);
}
