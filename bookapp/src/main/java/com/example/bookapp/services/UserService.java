package com.example.bookapp.services;

import com.example.bookapp.dto.input.UserRegisterDTO;
import com.example.bookapp.dto.output.UserResponseDTO;

public interface UserService {

    UserResponseDTO register(UserRegisterDTO dto);
}
