package com.example.bookapp.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    String storeCoverImage(MultipartFile file, String isbn);
}
