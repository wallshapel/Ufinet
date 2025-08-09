// src/components/deleteByIsbn/DeleteByIsbn.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Book } from "../../types/books/Book";
import Spinner from "../common/Spinner";
import type { Props } from "../../types/DeleteByIsbnProps";
import { fetchBookByIsbnAndUserId } from "../../api/bookApi";
import {
  deleteByIsbnSchema,
  type DeleteByIsbnFields,
} from "../../schemas/deleteByIsbnSchema";

export default function DeleteByIsbn({ onDelete }: Props) {
  const [bookFound, setBookFound] = useState<Book | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<DeleteByIsbnFields>({
    resolver: zodResolver(deleteByIsbnSchema),
    defaultValues: { isbn: "" },
  });

  const isbn = watch("isbn");

  useEffect(() => {
    setFocus("isbn");
  }, [setFocus]);

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

  const onSearch = async ({ isbn }: DeleteByIsbnFields) => {
    setLoading(true);
    setBookFound(null);

    try {
      const book = await fetchBookByIsbnAndUserId(isbn.trim());
      setBookFound(book);
      showFeedback("success", "Book found. You can delete it or cancel it.");
    } catch (error: any) {
      setBookFound(null);
      if (error?.response?.status === 404) {
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
      reset({ isbn: "" });
      setFocus("isbn");
    } catch (error: any) {
      console.error("Error deleting book:", error);
      showFeedback("error", error?.message || "Book could not be deleted");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({ isbn: "" });
    setBookFound(null);
    setFeedback(null);
    setFocus("isbn");
  };

  if (loading) return <Spinner />;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSearch)} className="mb-4">
        <label htmlFor="isbn" className="block font-medium text-sm mb-2">
          Search for books by ISBN:
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <input
            id="isbn"
            type="text"
            placeholder="ISBN of the book"
            className="p-2 border border-gray-300 rounded w-full sm:w-auto flex-1"
            {...register("isbn")}
          />
          <button
            type="submit"
            disabled={!isbn.trim()}
            className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
              !isbn.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {errors.isbn && (
        <p className="text-red-600 text-sm mb-2">{errors.isbn.message}</p>
      )}

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
