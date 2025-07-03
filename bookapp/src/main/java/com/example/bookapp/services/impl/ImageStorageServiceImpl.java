package com.example.bookapp.services.impl;

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
        // 🔒 Validaciones
        if (file.isEmpty()) throw new IllegalArgumentException("El archivo está vacío");

        String contentType = file.getContentType();
        if (contentType == null || !contentType.matches("image/(jpeg|png|jpg)")) {
            throw new IllegalArgumentException("Solo se permiten imágenes JPG o PNG");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("El tamaño máximo permitido es 5MB");
        }

        try {
            // 🧱 Directorio en disco
            Path uploadDir = Paths.get(BASE_UPLOAD_DIR + isbn).toAbsolutePath();
            Files.createDirectories(uploadDir);

            // 📎 Nombre del archivo
            String extension = contentType.contains("png") ? ".png" : ".jpg";
            String fileName = "cover" + extension;

            // 🗂 Ruta completa
            Path filePath = uploadDir.resolve(fileName);
            file.transferTo(filePath.toFile());

            // 🔁 Devolver solo ruta relativa
            return isbn + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }
    }
}
