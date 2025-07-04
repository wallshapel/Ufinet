import React from 'react';

type Props = {
    onValidFileSelect: (file: File) => void;
    currentFile?: File;
    showError: (message: string) => void;
};

export default function CoverInput({ onValidFileSelect, currentFile, showError }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            showError('Solo se permiten imágenes JPG o PNG');
            return;
        }

        if (file.size > maxSize) {
            showError('El tamaño máximo permitido es 5MB');
            return;
        }

        onValidFileSelect(file);
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-100"
            />
            {currentFile && (
                <p className="text-xs text-gray-600 mt-1">
                    Portada seleccionada: <span className="font-medium">{currentFile.name}</span>
                </p>
            )}
        </div>
    );
}
