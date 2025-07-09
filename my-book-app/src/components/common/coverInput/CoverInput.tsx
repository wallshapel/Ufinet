import React, { useRef } from "react";
import type { CoverInput } from "../../../types/books/CoverInput";

export default function CoverInput({
  onValidFileSelect,
  currentFile,
  showError,
}: CoverInput) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      showError("Only JPG or PNG images are allowed");
      return;
    }

    if (file.size > maxSize) {
      showError("Maximum size allowed is 5MB");
      return;
    }

    onValidFileSelect(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {currentFile ? "Change cover" : "Select cover"}
      </button>
      <span className="text-sm text-gray-700 italic truncate max-w-full sm:max-w-[200px]">
        {currentFile?.name || ""}
      </span>
    </div>
  );
}
