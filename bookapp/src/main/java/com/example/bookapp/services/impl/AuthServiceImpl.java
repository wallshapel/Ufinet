package com.example.bookapp.services.impl;

import com.example.bookapp.dto.input.LoginRequestDTO;
import com.example.bookapp.dto.output.LoginResponseDTO;
import com.example.bookapp.repositories.UserRepository;
import com.example.bookapp.security.jwt.JwtService;
import com.example.bookapp.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        var authToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        authenticationManager.authenticate(authToken);

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", user.getId());

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        var token = jwtService.generateToken(extraClaims, userDetails);

        return new LoginResponseDTO(token);
    }
}
