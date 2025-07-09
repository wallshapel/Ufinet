/// <reference types="vitest" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookTable from "./BookTable";
import { BookContext } from "../../../context/BookContext";
import type { Book } from "../../../types/books/Book";
import type { Genre } from "../../../types/genres/Genre";
import { vi } from "vitest";

// Dependencies Mocks
vi.mock("../../../api/bookApi", () => ({
  fetchBookByIsbnAndUserId: vi.fn().mockResolvedValue({
    isbn: "1234567890",
    title: "Test Book",
    genreId: 1,
    genre: "Fiction",
    publishedDate: "2023-01-01",
    synopsis: "Test synopsis",
    userId: 1,
    coverImagePath: "cover.jpg",
  }),
  fetchProtectedBookCover: vi.fn().mockResolvedValue("blob:test-cover-url"),
  uploadBookCover: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../utils/decodeToken", () => ({
  getUserIdFromToken: vi.fn().mockReturnValue(1),
}));

const mockBooks: Book[] = [
  {
    isbn: "1234567890",
    title: "Test Book 1",
    genreId: 1,
    genre: "Fiction",
    publishedDate: "2023-01-01",
    synopsis: "Test synopsis 1",
    createdAt: new Date().toISOString(),
    userId: 1,
    coverImagePath: "cover1.jpg",
  },
  {
    isbn: "0987654321",
    title: "Test Book 2",
    genreId: 2,
    genre: "Non-Fiction",
    publishedDate: "2023-02-01",
    synopsis: "Test synopsis 2",
    createdAt: new Date().toISOString(),
    userId: 1,
  },
];

const mockGenres: Genre[] = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
];

const mockContext = {
  books: mockBooks,
  genres: mockGenres,
  onDelete: vi.fn(),
  onEdit: vi.fn().mockResolvedValue({}),
  setBooks: vi.fn(),
  setGenres: vi.fn(),
  refreshGenres: vi.fn(),
  loading: false,
  page: 0,
  size: 5,
  totalPages: 1,
  selectedGenre: "",
  setSelectedGenre: vi.fn(),
  setPage: vi.fn(),
  setSize: vi.fn(),
  refreshBooks: vi.fn(),
};

describe("BookTable Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders correctly with books", () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    expect(screen.getByText("ISBN")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Genre")).toBeInTheDocument();
    expect(screen.getByText("Test Book 1")).toBeInTheDocument();
    expect(screen.getByText("Test Book 2")).toBeInTheDocument();
  });

  test("shows message when no books available", () => {
    render(
      <BookContext.Provider value={{ ...mockContext, books: [] }}>
        <BookTable />
      </BookContext.Provider>
    );

    expect(
      screen.getByText("There are no books available for display.")
    ).toBeInTheDocument();
  });

  test("enters edit mode when edit button is clicked", () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(screen.getByDisplayValue("Test Book 1")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("cancels edit mode when cancel button is clicked", () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Save")).not.toBeInTheDocument();
    expect(screen.getByText("Test Book 1")).toBeInTheDocument();
  });

  test("shows error message when required fields are missing in edit", async () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    // Clear required fields
    const titleInput = screen.getByDisplayValue("Test Book 1");
    fireEvent.change(titleInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText("Mandatory fields for editing are missing.")
      ).toBeInTheDocument();
    });
  });

  test("shows cover image modal when cover button is clicked", async () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const showCoverButtons = screen.getAllByText("Show");
    fireEvent.click(showCoverButtons[0]);

    await waitFor(() => {
      expect(screen.getByAltText("Book cover")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  test("displays success message after successful edit", async () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Correctly edited book.")).toBeInTheDocument();
    });
  });

  test("calls onDelete when delete button is clicked", () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(mockContext.onDelete).toHaveBeenCalledWith("1234567890");
    expect(screen.getByText("Book successfully deleted.")).toBeInTheDocument();
  });

  test("shows error message when user is not authenticated", async () => {
    localStorage.clear();

    render(
      <BookContext.Provider value={mockContext}>
        <BookTable />
      </BookContext.Provider>
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Unauthenticated user")).toBeInTheDocument();
    });
  });
});
