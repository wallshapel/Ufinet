/// <reference types="vitest" />

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookForm from "./BookForm";
import { BookContext } from "../../context/BookContext";
import type { BookContextType } from "../../types/contexts/BookContextType";
import { vi } from "vitest";

// Mock of the bookApi functions
vi.mock("../../api/bookApi", () => ({
  createBook: vi.fn().mockResolvedValue({
    isbn: "1234567890",
    title: "Test Book",
    genreId: 1,
    genre: "Fiction",
    publishedDate: "2023-01-01",
    synopsis: "A successful test.",
    createdAt: new Date().toISOString(),
    userId: 1,
  }),
  uploadBookCover: vi.fn().mockResolvedValue(undefined),
}));

// Mock of fetchGenresByUser
vi.mock("../../api/genreApi", () => ({
  fetchGenresByUser: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../utils/decodeToken", () => ({
  getUserIdFromToken: vi.fn().mockReturnValue(1),
}));

const mockContext: BookContextType = {
  books: [],
  setBooks: () => {},
  page: 1,
  size: 10,
  totalPages: 1,
  selectedGenre: "",
  setSelectedGenre: () => {},
  setPage: () => {},
  setSize: () => {},
  refreshBooks: () => {},
  onDelete: () => {},
  onEdit: () => {},
  loading: false,
  genres: [],
  setGenres: () => {},
  refreshGenres: async () => {},
};

describe("BookForm", () => {
  beforeEach(() => {
    localStorage.setItem("token", "FAKE_TOKEN");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("should render the form with ISBN field and Save button", () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookForm onAdd={vi.fn()} />
      </BookContext.Provider>
    );

    expect(screen.getByPlaceholderText(/ISBN/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  test("should show errors if the form is submitted empty", async () => {
    render(
      <BookContext.Provider value={mockContext}>
        <BookForm onAdd={vi.fn()} />
      </BookContext.Provider>
    );

    const submitButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/The ISBN is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/The title is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/The genre is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/The date is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/The synopsis is required/i)
    ).toBeInTheDocument();
  });

  test("should successfully submit the form and call onAdd", async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();

    render(
      <BookContext.Provider
        value={{
          ...mockContext,
          genres: [{ id: 1, name: "Fiction" }],
        }}
      >
        <BookForm onAdd={mockOnAdd} />
      </BookContext.Provider>
    );

    await user.type(screen.getByPlaceholderText(/ISBN/i), "1234567890");
    await user.type(screen.getByPlaceholderText(/Title/i), "Test Book");
    await user.selectOptions(screen.getByRole("combobox"), "1");
    await user.type(screen.getByLabelText(/Publication date/i), "2023-01-01");
    await user.type(
      screen.getByPlaceholderText(/Synopsis/i),
      "A successful test."
    );
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Book successfully added/i)
      ).toBeInTheDocument();
    });

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        isbn: "1234567890",
        title: "Test Book",
        genreId: 1,
      })
    );
  });

  test("should clear the form fields after successful submission", async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();

    render(
      <BookContext.Provider
        value={{
          ...mockContext,
          genres: [{ id: 1, name: "Fiction" }],
        }}
      >
        <BookForm onAdd={mockOnAdd} />
      </BookContext.Provider>
    );

    // Fill form
    await user.type(screen.getByPlaceholderText(/ISBN/i), "1234567890");
    await user.type(screen.getByPlaceholderText(/Title/i), "Test Book");
    await user.selectOptions(screen.getByRole("combobox"), "1");
    await user.type(screen.getByLabelText(/Publication date/i), "2023-01-01");
    await user.type(
      screen.getByPlaceholderText(/Synopsis/i),
      "A successful test."
    );

    // Submit form
    await user.click(screen.getByRole("button", { name: /save/i }));

    // Assert success message
    await waitFor(() => {
      expect(
        screen.getByText(/Book successfully added/i)
      ).toBeInTheDocument();
    });

    // Assert fields are cleared
    expect(screen.getByPlaceholderText(/ISBN/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Title/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Synopsis/i)).toHaveValue("");
    expect(screen.getByLabelText(/Publication date/i)).toHaveValue("");
    expect(screen.getByRole("combobox")).toHaveValue("");
  });
});

test("should show error and not submit if cover image has invalid type", async () => {
  const mockOnAdd = vi.fn();
  const user = userEvent.setup();

  render(
    <BookContext.Provider
      value={{
        ...mockContext,
        genres: [{ id: 1, name: "Fiction" }],
      }}
    >
      <BookForm onAdd={mockOnAdd} />
    </BookContext.Provider>
  );

  // Fill the form
  await user.type(screen.getByPlaceholderText(/ISBN/i), "1234567890");
  await user.type(screen.getByPlaceholderText(/Title/i), "Test Book");
  await user.selectOptions(screen.getByRole("combobox"), "1");
  await user.type(screen.getByLabelText(/Publication date/i), "2023-01-01");
  await user.type(
    screen.getByPlaceholderText(/Synopsis/i),
    "A successful test."
  );

  // Select invalid file (e.g. .pdf)
  const file = new File(["dummy"], "fake.pdf", { type: "application/pdf" });

  const hiddenFileInput = screen.getByRole("button", {
    name: /select cover/i,
  }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

  await waitFor(() => {
    Object.defineProperty(hiddenFileInput, "files", {
      value: [file],
    });
    fireEvent.change(hiddenFileInput);
  });

  expect(
    await screen.findByText(/Only JPG or PNG images are allowed/i)
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(mockOnAdd).not.toHaveBeenCalled();
});
test("should show error and not submit if cover image exceeds max size", async () => {
  const mockOnAdd = vi.fn();
  const user = userEvent.setup();

  render(
    <BookContext.Provider
      value={{
        ...mockContext,
        genres: [{ id: 1, name: "Fiction" }],
      }}
    >
      <BookForm onAdd={mockOnAdd} />
    </BookContext.Provider>
  );

  // Fill other fields
  await user.type(screen.getByPlaceholderText(/ISBN/i), "1234567890");
  await user.type(screen.getByPlaceholderText(/Title/i), "Test Book");
  await user.selectOptions(screen.getByRole("combobox"), "1");
  await user.type(screen.getByLabelText(/Publication date/i), "2023-01-01");
  await user.type(
    screen.getByPlaceholderText(/Synopsis/i),
    "A successful test."
  );

  // Simulate large file (6MB)
  const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.jpg", {
    type: "image/jpeg",
  });

  const fileInput = screen.getByRole("button", {
    name: /select cover/i,
  }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

  await waitFor(() => {
    Object.defineProperty(fileInput, "files", {
      value: [bigFile],
    });
    fireEvent.change(fileInput);
  });

  expect(
    await screen.findByText(/Maximum size allowed is 5MB/i)
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /save/i }));
  expect(mockOnAdd).not.toHaveBeenCalled();
});

