/// <reference types="vitest" />

import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";
import { vi } from "vitest";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();
  const mockOnSizeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should display current page and total pages", () => {
    render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size={10}
        onSizeChange={mockOnSizeChange}
      />
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  test("should disable Back button on first page", () => {
    render(
      <Pagination
        page={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size={10}
        onSizeChange={mockOnSizeChange}
      />
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeDisabled();
  });

  test("should disable Next button on last page", () => {
    render(
      <Pagination
        page={4}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size={10}
        onSizeChange={mockOnSizeChange}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  test("should call onPageChange when Back or Next is clicked", () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size={10}
        onSizeChange={mockOnSizeChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test("should call onSizeChange when a new size is selected", () => {
    render(
      <Pagination
        page={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
        size={10}
        onSizeChange={mockOnSizeChange}
      />
    );

    const select = screen.getByLabelText(/show:/i);
    fireEvent.change(select, { target: { value: "20" } });

    expect(mockOnSizeChange).toHaveBeenCalledWith(20);
  });
});
