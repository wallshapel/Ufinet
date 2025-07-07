import type { Book } from "../types/books/Book";
import type { BookPayload } from "../types/books/BookPayload";
import type { BookUpdatePayload } from "../types/books/BookUpdatePayload";
import type { PaginatedResponse } from "../types/paginations/PaginatedResponse";
import { getAuthData, getToken } from "../utils/decodeToken";
import axiosInstance from "./axiosInstance";

export async function fetchPaginatedBooks(
  userId: number,
  page: number,
  size: number
): Promise<PaginatedResponse> {
  const response = await axiosInstance.get<PaginatedResponse>("/books", {
    params: { userId, page, size },
  });

  return response.data;
}

export async function createBook(book: BookPayload): Promise<Book> {
  const response = await axiosInstance.post<Book>("/books", book, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function deleteBookByIsbn(isbn: string): Promise<void> {
  const { userId } = getAuthData();

  try {
    await axiosInstance.delete(`/books/${isbn}`, {
      params: { userId },
    });
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.detail;

    if (error.response?.status === 404)
      throw new Error(message || "Libro o usuario no encontrado");
    else if (error.response?.status === 400)
      throw new Error(message || "Petición incorrecta");
    else
      throw new Error("Error al intentar eliminar el libro");
  }
}

export async function fetchBookByIsbnAndUserId(isbn: string): Promise<Book> {
  const { userId } = getAuthData();

  const response = await axiosInstance.get<Book>(`/books/${isbn}`, {
    params: { userId },
  });

  return response.data;
}

export async function updateBook(
  updatedBook: BookUpdatePayload
): Promise<Book> {
  const { userId } = getAuthData();

  try {
    const bookWithUser = { ...updatedBook, userId };

    const response = await axiosInstance.patch<Book>("/books", bookWithUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data && typeof error.response.data === "object")
      throw error.response.data;

    throw new Error("Error al actualizar el libro");
  }
}

export async function fetchBooksByGenre(
  userId: number,
  genreId: number,
  page: number,
  size: number
): Promise<PaginatedResponse> {
  const response = await axiosInstance.get<PaginatedResponse>(
    `/books/user/${userId}/genre/${genreId}`,
    {
      params: { page, size },
    }
  );

  return response.data;
}

export async function uploadBookCover(
  isbn: string,
  coverFile: File
): Promise<void> {
  const { userId } = getAuthData();

  const formData = new FormData();
  formData.append("file", coverFile);

  await axiosInstance.patch(`/books/${isbn}/cover`, formData, {
    params: { userId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function fetchProtectedBookCover(
  userId: number,
  coverPath: string
): Promise<string> {
  const token = getToken();

  const response = await axiosInstance.get(
    `/books/cover?userId=${userId}&path=${encodeURIComponent(coverPath)}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`, // se requiere explícitamente aquí porque es una URL firmada
      },
    }
  );

  return URL.createObjectURL(response.data);
}
