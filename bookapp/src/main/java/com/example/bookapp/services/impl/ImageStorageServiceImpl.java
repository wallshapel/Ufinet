package com.example.bookapp.services.impl;

import com.example.bookapp.exceptions.ImageStorageException;
import com.example.bookapp.services.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    private static final String BASE_UPLOAD_DIR = "uploads/books/";

    @Override
    public String storeCoverImage(MultipartFile file, String isbn) {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");

        String contentType = file.getContentType();
        if (contentType == null || !contentType.matches("image/(jpeg|png|jpg)")) {
            throw new IllegalArgumentException("Only JPG or PNG images are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Maximum allowed file size is 5MB");
        }

        try {
            Path uploadDir = Paths.get(BASE_UPLOAD_DIR + isbn).toAbsolutePath();

            // 🧹 Delete existing files if directory already exists
            if (Files.exists(uploadDir)) {
                try (var paths = Files.list(uploadDir)) {
                    paths.forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            throw new ImageStorageException("Error deleting previous cover image: " + path, e);
                        }
                    });
                }
            }

            // 🏗️ Create directory if it doesn't exist (or recreate if emptied)
            Files.createDirectories(uploadDir);

            // 📎 Define extension and final name
            String extension = contentType.contains("png") ? ".png" : ".jpg";
            String fileName = "cover" + extension;
            Path filePath = uploadDir.resolve(fileName);

            // 💾 Save new file
            file.transferTo(filePath.toFile());

            // 🔁 Return relative path
            return isbn + "/" + fileName;

        } catch (IOException e) {
            throw new ImageStorageException("Error saving the image", e);
        }
    }
}
