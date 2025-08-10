/// <reference types="vitest" />
// my-book-app/src/components/deleteByIsbn/DeleteByIsbn.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteByIsbn from "./DeleteByIsbn";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Book } from "../../types/books/Book";

// Mock fetchBookByIsbnAndUserId
vi.mock("../../api/bookApi", () => ({
  fetchBookByIsbnAndUserId: vi.fn(),
}));

import { fetchBookByIsbnAndUserId } from "../../api/bookApi";

describe("DeleteByIsbn", () => {
  const mockBook: Book = {
    isbn: "9780306406157",
    title: "Mock Book",
    genre: "Fiction",
    publishedDate: "2022-01-01",
    synopsis: "Test synopsis",
    genreId: 1,
    userId: 1,
    createdAt: new Date().toISOString(),
  };

  const mockOnDelete = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders input and search button", () => {
    render(<DeleteByIsbn onDelete={mockOnDelete} />);
    expect(
      screen.getByPlaceholderText(/ISBN of the book/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("shows error if ISBN is empty", async () => {
    const { container } = render(<DeleteByIsbn onDelete={mockOnDelete} />);

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    expect(
      await screen.findByText("The ISBN must not be empty.")
    ).toBeInTheDocument();
  });

  test("shows error if ISBN is too short", async () => {
    render(<DeleteByIsbn onDelete={mockOnDelete} />);
    fireEvent.change(screen.getByPlaceholderText(/ISBN of the book/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(
      await screen.findByText(/at least 10 characters/i)
    ).toBeInTheDocument();
  });

  test("shows book details and allows deletion", async () => {
    (
      fetchBookByIsbnAndUserId as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockBook);

    render(<DeleteByIsbn onDelete={mockOnDelete} />);
    fireEvent.change(screen.getByPlaceholderText(/ISBN of the book/i), {
      target: { value: mockBook.isbn },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/Book found/i)).toBeInTheDocument();
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockBook.isbn);
    });

    expect(
      await screen.findByText(/successfully deleted/i)
    ).toBeInTheDocument();
  });

  test("shows not found message for 404", async () => {
    (
      fetchBookByIsbnAndUserId as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce({
      response: { status: 404 },
    });

    render(<DeleteByIsbn onDelete={mockOnDelete} />);
    fireEvent.change(screen.getByPlaceholderText(/ISBN of the book/i), {
      target: { value: "9780306406157" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(
      await screen.findByText(/No books with this ISBN were found/i)
    ).toBeInTheDocument();
  });

  test("shows generic error on unexpected failure", async () => {
    (
      fetchBookByIsbnAndUserId as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error("Server crash"));

    render(<DeleteByIsbn onDelete={mockOnDelete} />);
    fireEvent.change(screen.getByPlaceholderText(/ISBN of the book/i), {
      target: { value: "9780306406157" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(
      await screen.findByText(/An error occurred while searching/i)
    ).toBeInTheDocument();
  });
});
