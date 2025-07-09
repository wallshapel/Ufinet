import { render, screen, fireEvent } from "@testing-library/react";
import ResponsiveSynopsis from "./ResponsiveSynopsis";

describe("ResponsiveSynopsis", () => {
  const shortText = "Short synopsis.";
  const longText =
    "This is a very long synopsis intended to test the behavior of truncation and expansion.";

  test("renders full text if shorter than maxLength", () => {
    render(<ResponsiveSynopsis text={shortText} maxLength={100} />);
    expect(screen.getByText(shortText)).toBeInTheDocument();
    expect(screen.queryByText(/more/i)).not.toBeInTheDocument();
  });

  test('renders truncated text with "More..." if longer than maxLength', () => {
    render(<ResponsiveSynopsis text={longText} maxLength={20} />);
    expect(screen.getByText(/more/i)).toBeInTheDocument();
    expect(screen.getByText(/this is a very long/i)).toBeInTheDocument();
  });

  test('expands to show full text and "Show less" on click', () => {
    render(<ResponsiveSynopsis text={longText} maxLength={20} />);
    fireEvent.click(screen.getByText(/more/i));
    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(screen.getByText(/show less/i)).toBeInTheDocument();
  });

  test('collapses back to truncated text on "Show less" click', () => {
    render(<ResponsiveSynopsis text={longText} maxLength={20} />);
    fireEvent.click(screen.getByText(/more/i)); // expand
    fireEvent.click(screen.getByText(/show less/i)); // collapse
    expect(screen.getByText(/more/i)).toBeInTheDocument();
    expect(screen.queryByText(longText)).not.toBeInTheDocument();
  });
});
