package com.example.bookapp.services;

import com.example.bookapp.services.impl.ImageStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.*;

import static org.junit.jupiter.api.Assertions.*;

class ImageStorageServiceImplTest {

    private ImageStorageServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new ImageStorageServiceImpl();
    }

    @Test
    void storeCoverImage_shouldThrowIfFileIsEmpty() {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", "empty.jpg", "image/jpeg", new byte[0]
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.storeCoverImage(emptyFile, "1234567890")
        );

        assertEquals("File is empty", ex.getMessage());
    }

    @Test
    void storeCoverImage_shouldThrowIfContentTypeInvalid() {
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file", "doc.txt", "text/plain", "content".getBytes()
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.storeCoverImage(invalidFile, "1234567890")
        );

        assertEquals("Only JPG or PNG images are allowed", ex.getMessage());
    }

    @Test
    void storeCoverImage_shouldThrowIfFileTooLarge() {
        byte[] bigContent = new byte[6 * 1024 * 1024]; // 6MB

        MockMultipartFile bigFile = new MockMultipartFile(
                "file", "big.jpg", "image/jpeg", bigContent
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.storeCoverImage(bigFile, "1234567890")
        );

        assertEquals("Maximum allowed file size is 5MB", ex.getMessage());
    }

    @Test
    void storeCoverImage_shouldStoreFileSuccessfully() throws IOException {
        String isbn = "9876543210";
        String contentType = "image/png";
        byte[] content = "image-data".getBytes();

        MockMultipartFile validFile = new MockMultipartFile(
                "file", "cover.png", contentType, content
        );

        // Act
        String resultPath = service.storeCoverImage(validFile, isbn);

        // Assert
        Path expectedPath = Paths.get("uploads/books", resultPath).toAbsolutePath();
        assertTrue(Files.exists(expectedPath));
        assertTrue(resultPath.endsWith(".png"));
        assertTrue(resultPath.startsWith(isbn + "/"));

        // Limpieza
        Files.deleteIfExists(expectedPath);
        Files.deleteIfExists(expectedPath.getParent());
    }
}
