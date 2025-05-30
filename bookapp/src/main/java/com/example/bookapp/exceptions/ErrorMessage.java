package com.example.bookapp.exceptions;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorMessage {

    private String status;
    private String message;

}