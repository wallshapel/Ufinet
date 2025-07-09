import { render, screen, fireEvent } from "@testing-library/react";
import ImageModal from "./ImageModal";
import { vi } from "vitest";

describe("ImageModal", () => {
  const mockOnClose = vi.fn();
  const imageUrl = "https://example.com/cover.jpg";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders image with correct src", () => {
    render(<ImageModal src={imageUrl} onClose={mockOnClose} />);
    const img = screen.getByAltText("Book cover") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(imageUrl);
  });

  test("calls onClose when close button is clicked", () => {
    render(<ImageModal src={imageUrl} onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Escape key is pressed", () => {
    render(<ImageModal src={imageUrl} onClose={mockOnClose} />);
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
