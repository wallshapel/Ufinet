// src/components/books/BookForm.tsx
import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBook, uploadBookCover } from "../../api/bookApi";
import { fetchGenresByUser } from "../../api/genreApi";
import { getUserIdFromToken } from "../../utils/decodeToken";
import type { Props } from "../../types/books/BookFormProps";
import Spinner from "../common/Spinner";
import { useBookContext } from "../../context/BookContext";
import CoverInput from "../common/coverInput/CoverInput";
import { bookFormSchema, type BookFormFields } from "../../schemas/bookFormSchema";

const LazyGenreModal = lazy(() => import("../genres/GenreModal"));

export default function BookForm({ onAdd }: Props) {
  const { genres, setGenres, refreshGenres, refreshBooks } = useBookContext();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const isbnRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<BookFormFields>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      isbn: "",
      title: "",
      genreId: "",
      publishedDate: "",
      synopsis: "",
    }
  });

  // To be able to assign the manual ref and focus as before without losing the RHF ref
  const isbnReg = register("isbn");

  useEffect(() => {
    isbnRef.current?.focus();
    const loadGenres = async () => {
      try {
        const data = await fetchGenresByUser();
        setGenres(data);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    document.body.style.cursor = loading ? "wait" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [loading]);

  const onSubmit = async (data: BookFormFields) => {
    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;
    if (userId === null) {
      console.log("Unauthenticated user");
      return;
    }

    const bookToSend = {
      isbn: data.isbn,
      title: data.title,
      genreId: parseInt(data.genreId),
      publishedDate: data.publishedDate,
      synopsis: data.synopsis,
      userId,
    };

    try {
      setLoading(true);
      const newBook = await createBook(bookToSend);
      onAdd(newBook);

      if (coverFile) {
        try {
          await uploadBookCover(newBook.isbn, coverFile);
          await refreshBooks();
        } catch (error) {
          console.error("Error uploading the cover:", error);
          setError("coverFile", {
            type: "manual",
            message: "An error occurred while uploading the image",
          });
          return;
        }
      }

      reset(); // clear the form
      setCoverFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 409) {
        setError("isbn", {
          type: "manual",
          message: data?.message || "Duplicate book",
        });
      } else if (status === 404) {
        alert(data?.message || "User not found");
      } else if (status === 400 && typeof data === "object" && data) {
        // We assume that the backend returns an object { field: ‘message’ }
        Object.entries(data).forEach(([field, message]) => {
          setError(field as keyof BookFormFields, {
            type: "manual",
            message: String(message),
          });
        });
      } else {
        console.error("Unknown error when creating book:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4">
          Book successfully added.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 max-w-6xl mx-auto flex flex-col gap-4"
      >
        {/* Container 2 columns in md */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* ISBN */}
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <div className="flex items-center gap-2">
              <input
                {...isbnReg}
                ref={(el) => {
                  isbnReg.ref(el);
                  isbnRef.current = el || null;
                }}
                type="text"
                placeholder="ISBN"
                className="p-2 border border-gray-300 rounded w-full"
              />
              <span className="text-red-600 text-lg">*</span>
            </div>
            {errors.isbn && (
              <p className="text-red-600 text-sm mt-1">{errors.isbn.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <div className="flex items-center gap-2">
              <input
                {...register("title")}
                type="text"
                placeholder="Title"
                className="p-2 border border-gray-300 rounded w-full"
              />
              <span className="text-red-600 text-lg">*</span>
            </div>
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Genre + button "+" */}
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <div className="flex items-center gap-2">
              <select
                {...register("genreId")}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <span className="text-red-600 text-lg">*</span>
            </div>
            {errors.genreId && (
              <p className="text-red-600 text-sm mt-1">{errors.genreId.message}</p>
            )}
          </div>

          <button
            type="button"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 h-[38px]"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        {/* Publication date + Cover side by side */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date */}
          <div className="w-full md:w-1/2">
            <label
              htmlFor="publishedDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Publication date
            </label>
            <div className="flex items-center gap-2">
              <input
                {...register("publishedDate")}
                id="publishedDate"
                type="date"
                className="p-2 border border-gray-300 rounded w-full"
              />
              <span className="text-red-600 text-lg">*</span>
            </div>
            {errors.publishedDate && (
              <p className="text-red-600 text-sm mt-1">
                {errors.publishedDate.message}
              </p>
            )}
          </div>

          {/* Cover */}
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover
            </label>
            <CoverInput
              currentFile={coverFile || undefined}
              onValidFileSelect={(file) => setCoverFile(file)}
              showError={(msg) =>
                setError("coverFile", { type: "manual", message: msg })
              }
            />
            {errors.coverFile && (
              <p className="text-red-600 text-sm mt-1">{errors.coverFile.message}</p>
            )}
          </div>
        </div>

        {/* Synopsis (occupies all) */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Synopsis
          </label>
          <div className="flex items-center gap-2">
            <textarea
              {...register("synopsis")}
              placeholder="Synopsis"
              className="p-2 border border-gray-300 rounded resize-y min-h-[120px] max-h-[300px] w-full"
            />
            <span className="text-red-600 text-lg">*</span>
          </div>
          {errors.synopsis && (
            <p className="text-red-600 text-sm mt-1">{errors.synopsis.message}</p>
          )}
        </div>

        {/* Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-black px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            )}
            <span className="h-4 flex items-center">
              {loading ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </form>

      {showModal && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyGenreModal
            onClose={() => setShowModal(false)}
            onGenreCreated={async (newGenre) => {
              await refreshGenres();
              reset((prev) => ({
                ...prev,
                genreId: String(newGenre.id),
              }));
              setShowModal(false);
            }}
          />
        </Suspense>
      )}
    </>
  );
}
