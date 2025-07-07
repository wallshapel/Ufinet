import { useState, Suspense, lazy, useEffect } from "react";
import { getUserIdFromToken } from "../../utils/decodeToken";
import type { Book } from "../../types/books/Book";
import { useBookContext } from "../../context/BookContext";
import ImageModal from "./bookTable/ImageModal";
import {
  fetchBookByIsbnAndUserId,
  fetchProtectedBookCover,
  uploadBookCover,
} from "../../api/bookApi";
import CoverInput from "../common/CoverInput";
import ResponsiveSynopsis from "./bookTable/ResponsiveSynopsis";

const LazyGenreModal = lazy(() => import("./genres/GenreModal"));

export default function BookTable() {
  const { books, onDelete, onEdit, genres, refreshGenres } = useBookContext();

  const [editingIsbn, setEditingIsbn] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<
    Partial<Book> & { coverFile?: File }
  >({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { setBooks } = useBookContext();

  const showTemporaryMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    if (!text) return;

    setMessage({ type, text });

    if (type === "success") {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const startEdit = (book: Book) => {
    const matchingGenre = genres.find((g) => g.name === book.genre);
    const genreId = matchingGenre ? matchingGenre.id : book.genreId;

    setEditingIsbn(book.isbn);
    setEditForm({
      isbn: book.isbn,
      title: book.title,
      genreId,
      publishedDate: book.publishedDate,
      synopsis: book.synopsis,
    });
  };

  const cancelEdit = () => {
    setEditingIsbn(null);
    setEditForm({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "genreId" ? parseInt(value, 10) : value,
    });
  };

  const confirmEdit = async () => {
    const { isbn, title, genreId, publishedDate, synopsis } = editForm;

    if (!isbn || !title || !genreId || !publishedDate || !synopsis) {
      showTemporaryMessage("Mandatory fields for editing are missing.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;

    if (!userId) {
      showTemporaryMessage("Unauthenticated user");
      return;
    }

    const genreName = genres.find((g) => g.id === genreId)?.name || "";

    const updatedBook: Book = {
      isbn,
      title,
      genreId,
      genre: genreName,
      publishedDate,
      synopsis,
      userId,
      createdAt: new Date().toISOString(),
    };

    try {
      await onEdit(updatedBook);

      if (editForm.coverFile) {
        try {
          await uploadBookCover(isbn, editForm.coverFile);

          // 🆕 Force reload of updated book to get correct coverImagePath
          const updated = await fetchBookByIsbnAndUserId(isbn);

          setBooks((prev: Book[]) =>
            prev.map((book: Book) => (book.isbn === isbn ? updated : book))
          );
        } catch (error) {
          console.error("Error uploading cover page:", error);
          showTemporaryMessage(
            "Book edited, but there was an error uploading the cover.",
            "error"
          );
        }
      }

      setEditingIsbn(null);
      showTemporaryMessage("Correctly edited book.");
    } catch (error: any) {
      const backendError = error?.response?.data || error;
      if (typeof backendError === "object") {
        const allMessages = Object.values(backendError).join("\n");
        showTemporaryMessage(allMessages, "error");
      } else {
        showTemporaryMessage("Error when editing the book.", "error");
      }
    }

    setEditForm({});
  };

  const handleDelete = (isbn: string) => {
    onDelete(isbn);
    showTemporaryMessage("Book successfully deleted.");
  };

  useEffect(() => {
    const getImage = async () => {
      if (!selectedCover) {
        setImageUrl(null);
        return;
      }

      const token = localStorage.getItem("token");
      const userId = token ? getUserIdFromToken(token) : null;

      if (!userId) {
        console.warn("User not authenticated when trying to obtain cover page");
        setImageUrl(null);
        return;
      }

      try {
        const blobUrl = await fetchProtectedBookCover(userId, selectedCover);
        setImageUrl(blobUrl);
      } catch (error) {
        console.error("Error getting protected image", error);
        setImageUrl(null);
      }

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
          setImageUrl(null);
        }
      };
    };

    getImage();
  }, [selectedCover]);

  return (
    <>
      <div className="overflow-x-auto mt-8 px-4 sm:px-8">
        {message && (
          <div
            className={`${
              message.type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            } px-4 py-2 mb-4 rounded text-sm max-w-4xl`}
          >
            {message?.text || "⚠️ An unexpected error has occurred"}
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center text-gray-600 mt-4">
            There are no books available for display.
          </div>
        ) : (
          <table className="min-w-full text-sm bg-white border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border whitespace-nowrap">ISBN</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Genre</th>
                <th className="px-4 py-2 border whitespace-nowrap">
                  Published
                </th>
                <th className="px-4 py-2 border">Synopsis</th>
                <th className="px-4 py-2 border text-center">Cover</th>
                <th className="px-4 py-2 border text-center">Options</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book: Book) => (
                <tr key={book.isbn} className="hover:bg-blue-50 align-top">
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {book.isbn}
                  </td>

                  {editingIsbn === book.isbn ? (
                    <>
                      <td className="px-4 py-2 border">
                        <input
                          name="title"
                          value={editForm.title || ""}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded w-full"
                        />
                      </td>

                      <td className="px-4 py-2 border">
                        <div className="flex items-center gap-2">
                          <select
                            name="genreId"
                            value={editForm.genreId || ""}
                            onChange={handleEditChange}
                            className="p-2 border border-gray-300 rounded w-full"
                          >
                            <option value="">Select a genre</option>
                            {genres.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-2 border">
                        <input
                          name="publishedDate"
                          type="date"
                          value={editForm.publishedDate || ""}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded w-full"
                        />
                      </td>

                      <td className="px-4 py-2 border">
                        <textarea
                          name="synopsis"
                          value={editForm.synopsis || ""}
                          onChange={handleEditChange}
                          className="p-2 border border-gray-300 rounded w-full resize-y min-h-[120px] max-h-[300px]"
                        />
                      </td>

                      <td className="px-4 py-2 border">
                        <CoverInput
                          currentFile={editForm.coverFile}
                          onValidFileSelect={(file) =>
                            setEditForm((prev) => ({
                              ...prev,
                              coverFile: file,
                            }))
                          }
                          showError={(msg) =>
                            showTemporaryMessage(msg, "error")
                          }
                        />
                      </td>

                      <td className="px-4 py-2 border">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={confirmEdit}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 border">{book.title}</td>
                      <td className="px-4 py-2 border">{book.genre}</td>
                      <td className="px-4 py-2 border whitespace-nowrap">
                        {book.publishedDate}
                      </td>

                      <td className="px-4 py-2 border max-w-xs">
                        <span className="hidden md:inline">
                          {book.synopsis}
                        </span>
                        <ResponsiveSynopsis text={book.synopsis} />
                      </td>

                      <td className="px-4 py-2 border text-center">
                        {book.coverImagePath ? (
                          <button
                            onClick={() =>
                              setSelectedCover(book.coverImagePath!)
                            }
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            Show
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            No cover
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2 border">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            onClick={() => startEdit(book)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.isbn)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyGenreModal
            onClose={() => setShowModal(false)}
            onGenreCreated={async (newGenre) => {
              await refreshGenres();
              setEditForm((prev) => ({
                ...prev,
                genreId: newGenre.id,
              }));
              setShowModal(false);
            }}
          />
        </Suspense>
      )}

      {selectedCover && imageUrl && (
        <ImageModal src={imageUrl} onClose={() => setSelectedCover(null)} />
      )}
    </>
  );
}
