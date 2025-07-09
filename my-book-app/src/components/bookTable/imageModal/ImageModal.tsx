import { useEffect } from "react";
import type { ImageModal } from "../../../types/books/ImageModal";

export default function ImageModal({ src, onClose }: ImageModal) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-2">
      <div className="bg-white p-4 rounded shadow-lg max-w-2xl w-[90%] relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <img src={src} alt="Book cover" className="max-h-[70vh] mx-auto" />
      </div>
    </div>
  );
}