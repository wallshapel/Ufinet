import { useState, useRef, useEffect } from "react";
import type { Book } from "../../types/books/Book";
import Spinner from "../common/Spinner";
import type { Props } from "../../types/DeleteByIsbnProps";
import { fetchBookByIsbnAndUserId } from "../../api/bookApi";

export default function DeleteByIsbn({ onDelete }: Props) {
  const [isbnInput, setIsbnInput] = useState("");
  const [bookFound, setBookFound] = useState<Book | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isbnInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bookFound]);

  const showFeedback = (type: "error" | "success", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSearch = async () => {
    const isbn = isbnInput.trim();

    if (!isbn) {
      setInputError("The ISBN must not be empty.");
      return;
    }

    if (isbn.length < 10) {
      setInputError("The ISBN must be at least 10 characters long.");
      return;
    }

    setInputError(null);
    setLoading(true);

    try {
      const book = await fetchBookByIsbnAndUserId(isbn);
      setBookFound(book);
      showFeedback("success", "Book found. You can delete it or cancel it.");
    } catch (error: any) {
      setBookFound(null);
      if (error.response?.status === 404) {
        showFeedback(
          "error",
          "No books with this ISBN were found for this user."
        );
      } else {
        console.error("Error when searching for book:", error);
        showFeedback(
          "error",
          "An error occurred while searching for the book."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bookFound) return;

    setLoading(true);
    try {
      await onDelete(bookFound.isbn);
      showFeedback(
        "success",
        `Book "${bookFound.title}" successfully deleted.`
      );
      setBookFound(null);
      setIsbnInput("");
    } catch (error: any) {
      console.error("Error deleting book:", error);
      showFeedback("error", error.message || "Book could not be deleted");
    } finally {
      setLoading(false);
      isbnInputRef.current?.focus();
    }
  };

  const handleCancel = () => {
    setIsbnInput("");
    setBookFound(null);
    setFeedback(null);
    setInputError(null);
    isbnInputRef.current?.focus();
  };

  if (loading) return <Spinner />;

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="mb-4"
      >
        <label htmlFor="isbn" className="block font-medium text-sm mb-2">
          Search for books by ISBN:
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <input
            ref={isbnInputRef}
            id="isbn"
            type="text"
            placeholder="ISBN of the book"
            value={isbnInput}
            onChange={(e) => {
              setIsbnInput(e.target.value);
              if (inputError) setInputError(null);
            }}
            className="p-2 border border-gray-300 rounded w-full sm:w-auto flex-1"
          />
          <button
            type="submit"
            disabled={!isbnInput.trim()}
            className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
              !isbnInput.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {inputError && <p className="text-red-600 text-sm mb-2">{inputError}</p>}

      {feedback && (
        <div
          className={`px-4 py-2 mb-4 rounded text-sm ${
            feedback.type === "error"
              ? "bg-red-100 text-red-800 border border-red-300"
              : "bg-green-100 text-green-800 border border-green-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {bookFound && (
        <div className="border border-blue-200 rounded p-4 mb-4 bg-blue-50">
          <p>
            <strong>Title:</strong> {bookFound.title}
          </p>
          <p>
            <strong>Genre:</strong> {bookFound.genre}
          </p>
          <p>
            <strong>Published:</strong> {bookFound.publishedDate}
          </p>
          <p>
            <strong>Synopsis:</strong> {bookFound.synopsis}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
            >
              Delete
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
