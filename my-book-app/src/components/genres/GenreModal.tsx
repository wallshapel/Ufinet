import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGenre } from "../../api/genreApi";
import { getUserIdFromToken } from "../../utils/decodeToken";
import Spinner from "../common/Spinner";
import {
  genreModalSchema,
  type GenreModalFields,
} from "../../schemas/genreModalSchema";

interface Props {
  onClose: () => void;
  onGenreCreated: (genre: { id: number; name: string }) => void;
}

export default function GenreModal({ onClose, onGenreCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
    reset,
  } = useForm<GenreModalFields>({
    resolver: zodResolver(genreModalSchema),
    defaultValues: { name: "" },
  });

  // Focus on input when modal opens
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmit = async ({ name }: GenreModalFields) => {
    const token = localStorage.getItem("token");
    const userId = token ? getUserIdFromToken(token) : null;

    if (!token || userId === null) {
      setError("name", { type: "manual", message: "Unauthenticated user" });
      return;
    }

    try {
      setLoading(true);
      const createdGenre = await createGenre({ name, userId });
      setSuccess(true);
      // Small delay to show success feedback before closing/propagating
      setTimeout(() => onGenreCreated(createdGenre), 1000);
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 409) {
        setError("name", {
          type: "manual",
          message: data?.message || "Duplicate gender",
        });
      } else if (status === 404) {
        setError("name", {
          type: "manual",
          message: data?.message || "User not found",
        });
      } else if (status === 400 && typeof data === "object") {
        setError("name", {
          type: "manual",
          message: data?.detail || "Malformed request",
        });
      } else {
        setError("name", {
          type: "manual",
          message: "Unexpected error when creating the gender",
        });
      }
    } finally {
      setLoading(false);
      reset({ name: "" });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-md">
        <h2 className="text-lg font-bold mb-4">New genre</h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4 text-center">
            Gender successfully created.
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Gender name"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-700 text-white hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
